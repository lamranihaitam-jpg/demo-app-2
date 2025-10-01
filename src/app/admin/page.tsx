"use client"

import React, { useState } from 'react'

type Slot = { time: string; capacity?: number }
type Session = { startDate: string; endDate?: string; location?: string; slots: Slot[] }

export default function AdminPage(){
  // course
  const presetFormations = ['Formation 1','Formation 2','Formation 3','Formation 4','Autre (personnalisée)']
  const [presetChoice, setPresetChoice] = useState(presetFormations[0])
  const [customTitle, setCustomTitle] = useState('')
  const title = presetChoice === 'Autre (personnalisée)' ? customTitle : presetChoice

  // sessions state
  const [sessions, setSessions] = useState<Session[]>([
    { startDate: '', endDate: '', location: '', slots: [{ time: '09:00', capacity: 10 }] }
  ])

  const [message, setMessage] = useState('')
  const [adminTokenInput, setAdminTokenInput] = useState('')
  const [apiError, setApiError] = useState<string | null>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  // Helpers
  function updateSession(idx: number, patch: Partial<Session>){
    setSessions(s => s.map((sesh,i) => i===idx ? { ...sesh, ...patch } : sesh))
  }

  function addSession(){
    setSessions(s => [...s, { startDate:'', endDate:'', location:'', slots: [{ time:'09:00', capacity:10 }] }])
  }

  function removeSession(idx:number){
    setSessions(s => s.filter((_,i)=>i!==idx))
  }

  function addSlot(sessionIdx:number){
    setSessions(s => s.map((ss, i) => i===sessionIdx ? { ...ss, slots: [...ss.slots, { time:'09:00', capacity:10 }] } : ss))
  }

  function updateSlot(sessionIdx:number, slotIdx:number, patch: Partial<Slot>){
    setSessions(s => s.map((ss,i)=>{
      if (i!==sessionIdx) return ss
      const slots = ss.slots.map((sl,j) => j===slotIdx ? { ...sl, ...patch } : sl)
      return { ...ss, slots }
    }))
  }

  function removeSlot(sessionIdx:number, slotIdx:number){
    setSessions(s => s.map((ss,i)=> i===sessionIdx ? { ...ss, slots: ss.slots.filter((_,j)=>j!==slotIdx) } : ss))
  }

  // validation: require title and at least one session with one slot and startDate set
  const isValid = Boolean(title && sessions.length>0 && sessions.every(s=>s.startDate && s.slots.length>0 && s.slots.every(sl=>sl.time)))

  function buildPreview(){
    if (!isValid) return 'Sélection actuelle :' // no preview
    const first = sessions[0]
    const firstSlot = first.slots[0]
    return `${title} — ${first.startDate} @ ${firstSlot.time}`
  }

  async function handleCreate(){
    setMessage('')
    try{
      setApiError(null)
      const adminToken = adminTokenInput || (process.env.NEXT_PUBLIC_ADMIN_TOKEN || '')
      const payload: any = { title, sessions }
      const method = editingId ? 'PATCH' : 'POST'
      const url = editingId ? `/api/admin/courses/${editingId}` : '/api/admin/courses'
      const res = await fetch(url, { method, headers: { 'content-type':'application/json', 'x-admin-token': adminToken }, body: JSON.stringify(payload) })
      const j = await res.json()
      if (!j.success) {
        setApiError(j.message || j.error || 'Erreur API inconnue')
        setMessage('')
      } else {
        setMessage(editingId ? 'Mis à jour' : 'Créé')
        setApiError(null)
        // refresh list
        await loadCourses()
        // reset editing state
        setEditingId(null)
      }
    }catch(e:any){
      setApiError(String(e))
      setMessage('')
    }
  }

  async function loadCourses(){
    try{
      const res = await fetch('/api/admin/courses')
      const j = await res.json()
      if (j && j.success) setCourses(j.data)
    }catch(_){ }
  }

  React.useEffect(()=>{ loadCourses() }, [])

  async function handleDelete(id:string){
    if (!confirm('Supprimer cette formation ? Cela supprimera aussi les sessions associées.')) return
    try{
      const adminToken = adminTokenInput || (process.env.NEXT_PUBLIC_ADMIN_TOKEN || '')
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE', headers: { 'x-admin-token': adminToken } })
      const j = await res.json()
      if (!j.success) return setApiError(j.message || 'Erreur suppression')
      await loadCourses()
    }catch(e:any){ setApiError(String(e)) }
  }

  function startEdit(course:any){
    setEditingId(course.id)
    // map course into form shape
    setPresetChoice(course.title && ['Formation 1','Formation 2','Formation 3','Formation 4'].includes(course.title) ? course.title : 'Autre (personnalisée)')
    if (!['Formation 1','Formation 2','Formation 3','Formation 4'].includes(course.title)) setCustomTitle(course.title || '')
    // map sessions
    setSessions(course.sessions.map((s:any)=>({ startDate: s.startDate.slice(0,10), endDate: s.endDate ? s.endDate.slice(0,10) : '', location: s.location || '', slots: s.slots.map((sl:any)=>({ time: sl.time, capacity: sl.capacity })) })) )
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className='min-h-screen flex items-start justify-center pt-28 pb-12'>
      <div className='w-full max-w-3xl'>
        <h1 className='text-2xl font-semibold mb-6 text-center'>Ajouter une formation</h1>
        <div className='mx-auto max-w-2xl space-y-4 bg-white p-6 rounded'>

          <div>
            <label className='block text-sm font-medium mb-1'>Formation</label>
            <select value={presetChoice} onChange={(e) => setPresetChoice(e.target.value)} className='block w-full p-2 border rounded'>
              {presetFormations.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {presetChoice === 'Autre (personnalisée)' && (
              <input
                placeholder='Titre personnalisé'
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className='block w-full p-2 border rounded mt-2'
              />
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Dates disponibles & créneaux</label>
            <div className='space-y-4'>
              {sessions.map((s, idx) => (
                <div key={idx} className='p-3 border rounded'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex gap-2'>
                      <div>
                        <label className='text-xs text-gray-600'>Date début</label>
                        <input
                          type='date'
                          value={s.startDate}
                          onChange={(e) => updateSession(idx, { startDate: e.target.value })}
                          className='ml-2 p-1 border rounded'
                        />
                      </div>
                      <div>
                        <label className='text-xs text-gray-600'>Date fin</label>
                        <input
                          type='date'
                          value={s.endDate}
                          onChange={(e) => updateSession(idx, { endDate: e.target.value })}
                          className='ml-2 p-1 border rounded'
                        />
                      </div>
                      <div>
                        <label className='text-xs text-gray-600'>Lieu</label>
                        <input
                          placeholder='Ex: Paris'
                          value={s.location}
                          onChange={(e) => updateSession(idx, { location: e.target.value })}
                          className='ml-2 p-1 border rounded'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='mt-2'>
                    <div className='text-sm font-medium mb-1'>Créneaux</div>
                    <div className='space-y-2'>
                      {s.slots.map((sl, si) => (
                        <div key={si} className='flex items-center gap-2'>
                          <input
                            type='time'
                            value={sl.time}
                            onChange={(e) => updateSlot(idx, si, { time: e.target.value })}
                            className='p-1 border rounded'
                          />
                          <input
                            type='number'
                            min={1}
                            value={sl.capacity ?? 10}
                            onChange={(e) => updateSlot(idx, si, { capacity: Number(e.target.value) })}
                            className='w-24 p-1 border rounded'
                          />
                          <button
                            onClick={() => removeSlot(idx, si)}
                            className='text-sm text-red-600 hover:underline'>
                            Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className='mt-2 flex justify-between items-center'>
                      <div>
                        <button
                          onClick={() => addSlot(idx)}
                          className='text-sm bg-gray-100 px-2 py-1 rounded hover:bg-gray-200'>
                          Ajouter créneau
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => removeSession(idx)}
                          className='px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 hover:shadow-md transition-all'>
                          Supprimer date
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-3'>
              <button
                onClick={addSession}
                className='bg-primary text-white px-3 py-1 rounded hover:brightness-110'>
                Ajouter une date
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Admin token</label>
            <input
              className='block w-full p-2 border rounded'
              placeholder='Admin token'
              value={adminTokenInput}
              onChange={(e) => setAdminTokenInput(e.target.value)}
            />
          </div>

          <div className='flex items-center gap-3'>
            <button
              className='bg-primary text-white px-4 py-2 rounded transition-transform duration-150 hover:scale-105 disabled:opacity-50'
              onClick={handleCreate}
              disabled={!isValid}>
              {editingId ? 'Mettre à jour' : 'Ajouter une formation'}
            </button>
            <div className='text-sm text-gray-700'>{message}</div>
          </div>
          {apiError && <div className='text-sm text-red-600'>API error: {apiError}</div>}
        </div>
      </div>
    </main>
  )
}
