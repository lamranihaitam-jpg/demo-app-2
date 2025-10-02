"use client"

import React, { useEffect, useState } from "react"

type Slot = { time: string; capacity?: number }
type Session = { id?: string; startDate: string; endDate?: string; location?: string; slots: Slot[] }
type CoursePayload = { title: string; description?: string; sessions: Session[] }

// Demo data (same shape used by Calendar) - used as a fallback when Prisma/API isn't available
const demoSessionsForAdmin = [
  {
    id: 's1',
    title: 'Formation 1',
    description: '',
    sessions: [
      { id: 's1-1', startDate: '2025-10-02', endDate: '2025-10-02', location: 'Paris', slots: [{ time: '09:00' }, { time: '14:00' }, { time: '16:30' }, { time: '18:00' }] },
      { id: 's1-2', startDate: '2025-10-09', endDate: '2025-10-09', location: 'Lyon', slots: [{ time: '09:00' }, { time: '14:00' }] },
    ],
  },
  {
    id: 's2',
    title: 'Formation 2',
    description: '',
    sessions: [
      { id: 's2-1', startDate: '2025-10-20', endDate: '2025-10-20', location: '', slots: [{ time: '09:00' }, { time: '14:00' }, { time: '16:00' }, { time: '18:00' }] },
    ],
  },
]

export default function AdminPage() {
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authMode, setAuthMode] = useState<"creds" | "token">("creds")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [tokenInput, setTokenInput] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)

  // simple dev credentials/token (change locally as needed)
  const DEV_USERNAME = "admin"
  const DEV_PASSWORD = "password123"
  const DEV_TOKEN = "secret123"

  // Form state
  const presets = ["Formation 1", "Formation 2", "Formation 3", "Formation 4", "Autre (personnalisée)"]
  const [presetChoice, setPresetChoice] = useState(presets[0])
  const [customTitle, setCustomTitle] = useState("")
  const [description, setDescription] = useState("")
  const [sessions, setSessions] = useState<Session[]>([
    { startDate: "", endDate: "", location: "", slots: [{ time: "09:00", capacity: 10 }] },
  ])
  const [adminToken, setAdminToken] = useState<string>("")
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [useDemoData, setUseDemoData] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const title = presetChoice === "Autre (personnalisée)" ? customTitle : presetChoice

  // Basic auth handling
  function handleLogin() {
    setLoginError(null)
    if (authMode === "creds") {
      if (username === DEV_USERNAME && password === DEV_PASSWORD) {
        setIsAuthenticated(true)
        setAdminToken(DEV_TOKEN)
      } else setLoginError("Identifiants incorrects")
    } else {
      if (tokenInput === DEV_TOKEN) {
        setIsAuthenticated(true)
        setAdminToken(tokenInput)
      } else setLoginError("Token invalide")
    }
  }

  // Sessions helpers
  function addSession() {
    setSessions(s => [...s, { startDate: "", endDate: "", location: "", slots: [{ time: "09:00", capacity: 10 }] }])
  }
  function removeSession(idx: number) {
    setSessions(s => s.filter((_, i) => i !== idx))
  }
  function addSlot(sessionIdx: number) {
    setSessions(s => s.map((ss, i) => i === sessionIdx ? { ...ss, slots: [...ss.slots, { time: "09:00", capacity: 10 }] } : ss))
  }
  function removeSlot(sessionIdx: number, slotIdx: number) {
    setSessions(s => s.map((ss, i) => i === sessionIdx ? { ...ss, slots: ss.slots.filter((_, j) => j !== slotIdx) } : ss))
  }

  // Validation
  const isValid = Boolean(title && sessions.length > 0 && sessions.every(s => s.startDate && s.slots.length > 0 && s.slots.every(sl => sl.time)))

  // API calls
  async function fetchCourses() {
    try {
      const res = await fetch("/api/courses")
      const j = await res.json()
      if (j && j.success && Array.isArray(j.data) && j.data.length>0){
        // map API shape to admin-friendly shape (like Calendar)
        const mapped = j.data.map((c:any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          sessions: Array.isArray(c.sessions) ? c.sessions.map((s:any) => ({
            id: s.id,
            startDate: s.startDate ? s.startDate.slice(0,10) : '',
            endDate: s.endDate ? s.endDate.slice(0,10) : '',
            location: s.location || '',
            slots: Array.isArray(s.slots) ? s.slots.map((sl:any) => ({ time: sl.time, capacity: sl.capacity })) : [],
          })) : [],
        }))
        setCourses(mapped)
        return
      }
      // fallback: if API returned empty or no data, use demo data
      if (!useDemoData) {
        const mappedDemo = demoSessionsForAdmin
        setCourses(mappedDemo)
      }
    } catch (e) {
      // On fetch error, fall back to demo data so admin UI remains usable without Prisma
      setCourses(demoSessionsForAdmin)
    }
  }
  useEffect(() => { fetchCourses() }, [])

  async function createOrUpdateCourse() {
    setApiError(null)
    setSuccessMsg(null)
    if (!isValid) {
      setApiError("Complètez le titre, au moins une date et un créneau.")
      return
    }
    const payload: CoursePayload = { title, description, sessions }
    try {
      const url = editingId ? `/api/admin/courses/${editingId}` : "/api/admin/courses"
      const method = editingId ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-admin-token": adminToken || "" },
        body: JSON.stringify(payload),
      })
      const j = await res.json()
      if (!res.ok) {
        setApiError(j?.message ?? "Erreur API")
        return
      }
      setSuccessMsg(editingId ? "Course mise à jour" : "Course créée")
      setEditingId(null)
      // reset form
      setPresetChoice(presets[0]); setCustomTitle(""); setDescription("")
      setSessions([{ startDate: "", endDate: "", location: "", slots: [{ time: "09:00", capacity: 10 }] }])
      fetchCourses()
    } catch (err:any) {
      setApiError(err?.message ?? "Erreur réseau")
    }
  }

  async function handleEdit(course:any) {
    setEditingId(course.id)
    setPresetChoice(presets.includes(course.title) ? course.title : "Autre (personnalisée)")
    setCustomTitle(presets.includes(course.title) ? "" : course.title)
    setDescription(course.description ?? "")
    const mappedSessions = (course.sessions || []).map((s:any)=>({
      id: s.id,
      startDate: s.startDate?.slice(0,10) ?? "",
      endDate: s.endDate?.slice(0,10) ?? "",
      location: s.location ?? "",
      slots: (s.slots || []).map((sl:any)=>({ time: sl.time, capacity: sl.capacity }))
    }))
    setSessions(mappedSessions.length ? mappedSessions : [{ startDate: "", endDate: "", location: "", slots: [{ time: "09:00", capacity: 10 }] }])
    // keep adminToken as is
  }

  async function handleDelete(id:string) {
    if (!confirm("Supprimer cette formation ?")) return
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE", headers: { "x-admin-token": adminToken || "" } })
      const j = await res.json()
      if (!res.ok) { setApiError(j?.message ?? "Erreur suppression"); return }
      fetchCourses()
    } catch (e:any) { setApiError(e?.message ?? "Erreur réseau") }
  }

  // Render login if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Admin login</h2>

          <div className="mb-4 flex gap-2 justify-center">
            <button onClick={()=>setAuthMode("creds")} className={`px-3 py-1 rounded ${authMode==="creds" ? "bg-primary text-white" : "bg-gray-100"}`}>Utilisateur/Mot de passe</button>
            <button onClick={()=>setAuthMode("token")} className={`px-3 py-1 rounded ${authMode==="token" ? "bg-primary text-white" : "bg-gray-100"}`}>Token</button>
          </div>

          {authMode==="creds" ? (
            <>
              <label className="block text-sm">Nom d'utilisateur</label>
              <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full p-2 border rounded mb-2" />
              <label className="block text-sm">Mot de passe</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 border rounded mb-3" />
            </>
          ) : (
            <>
              <label className="block text-sm">Token admin</label>
              <input value={tokenInput} onChange={(e)=>setTokenInput(e.target.value)} className="w-full p-2 border rounded mb-3" placeholder="collez le token dev" />
            </>
          )}

          {loginError && <p className="text-red-600 text-sm mb-2">{loginError}</p>}

          <div className="flex gap-2">
            <button onClick={handleLogin} className="flex-1 bg-primary text-white py-2 rounded hover:brightness-105">Se connecter</button>
          </div>

          <p className="text-xs text-gray-500 mt-3">Pour dev: user=admin / pass=password123 ou token=secret123</p>
        </div>
      </main>
    )
  }

  // Admin UI
  return (
    <main className="min-h-screen bg-gray-50 py-25 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: list */}
        <aside className="lg:col-span-1 bg-white p-4 rounded">
          <h3 className="font-semibold mb-3">Formations existantes</h3>
          <div className="space-y-3 max-h-[60vh] overflow-auto">
            {courses.length === 0 && <p className="text-sm text-gray-500">Aucune formation</p>}
            {courses.map((c) => (
              <div key={c.id} className="border rounded p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-sm text-gray-500">{(c.sessions?.length || 0)} dates</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-2 py-1 text-sm bg-yellow-200 rounded hover:brightness-95">
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:brightness-95">
                      Suppr.
                    </button>
                  </div>
                </div>

                {/* résumé des prochaines dates + créneaux (style Calendar) */}
                <div className="mt-2 text-sm text-gray-700">
                  {Array.isArray(c.sessions) && c.sessions.length > 0 ? (
                    <ul className="space-y-2">
                      {c.sessions.slice(0, 3).map((s: any) => (
                        <li key={s.id ?? s.startDate} className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {s.startDate ? (() => {
                                const d = new Date(s.startDate)
                                const dd = String(d.getDate()).padStart(2,'0')
                                const mm = String(d.getMonth()+1).padStart(2,'0')
                                const yy = d.getFullYear()
                                return `${dd}/${mm}/${yy}`
                              })() : s.startDate}
                            </span>
                            <span className="text-xs text-gray-500">{s.location ?? ''}</span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {Array.isArray(s.slots) && s.slots.slice(0, 4).map((sl: any, i: number) => (
                              <span key={i} className="text-xs px-2 py-1 rounded border bg-gray-50">
                                {sl.time}
                              </span>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-gray-500">Aucune date</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right column: form */}
        <section className="lg:col-span-2 bg-white p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">{editingId ? "Modifier une formation" : "Ajouter une formation"}</h2>

          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm">Formation</label>
            <select value={presetChoice} onChange={(e)=>setPresetChoice(e.target.value)} className="p-2 border rounded">
              {presets.map(p=> <option key={p} value={p}>{p}</option>)}
            </select>

            {presetChoice==="Autre (personnalisée)" && (
              <>
                <label className="text-sm">Titre personnalisé</label>
                <input value={customTitle} onChange={e=>setCustomTitle(e.target.value)} className="p-2 border rounded" />
              </>
            )}

            <label className="text-sm">Description (optionnel)</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} className="p-2 border rounded" rows={3} />

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Dates & créneaux</h4>
                <div>
                  <button onClick={addSession} className="px-2 py-1 bg-green-100 rounded hover:brightness-95 mr-2">Ajouter date</button>
                </div>
              </div>

              <div className="space-y-4">
                {sessions.map((s, idx)=>(
                  <div key={idx} className="border rounded p-3">
                    <div className="flex gap-2 items-center">
                      <label className="text-sm w-24">Date</label>
                      <input type="date" value={s.startDate} onChange={e=>setSessions(prev=>prev.map((ps,i)=>i===idx?{...ps,startDate:e.target.value}:ps))} className="p-2 border rounded" />
                      <label className="text-sm w-24">Lieu</label>
                      <input value={s.location} onChange={e=>setSessions(prev=>prev.map((ps,i)=>i===idx?{...ps,location:e.target.value}:ps))} className="p-2 border rounded" />
                      <button onClick={()=>removeSession(idx)} className="ml-auto px-2 py-1 bg-red-100 text-red-700 rounded hover:brightness-95">Supprimer date</button>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Créneaux</div>
                        <button onClick={()=>addSlot(idx)} className="px-2 py-1 bg-blue-100 rounded hover:brightness-95">Ajouter créneau</button>
                      </div>

                      <div className="space-y-2">
                        {s.slots.map((sl, j)=>(
                          <div key={j} className="flex gap-2 items-center">
                            <input value={sl.time} onChange={e=> {
                              const v=e.target.value
                              setSessions(prev=>prev.map((ps,i)=> i===idx ? { ...ps, slots: ps.slots.map((slt,k)=> k===j ? {...slt, time:v} : slt ) } : ps ))
                            }} className="p-2 border rounded w-28" />
                            <input type="number" value={sl.capacity ?? 10} onChange={e=>{
                              const v = Number(e.target.value)
                              setSessions(prev=>prev.map((ps,i)=> i===idx ? { ...ps, slots: ps.slots.map((slt,k)=> k===j ? {...slt, capacity:v} : slt ) } : ps ))
                            }} className="p-2 border rounded w-24" />
                            <button onClick={()=>removeSlot(idx,j)} className="px-2 py-1 bg-red-50 text-red-700 rounded hover:brightness-95">Suppr.</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <label className="text-sm w-28">Admin token</label>
              <input value={adminToken} onChange={e=>setAdminToken(e.target.value)} className="p-2 border rounded flex-1" placeholder="collez le token dev (secret123)" />
              <button onClick={createOrUpdateCourse} disabled={!isValid} className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50">{
                editingId ? "Mettre à jour" : "Créer"
              }</button>
            </div>

            {apiError && <p className="text-red-600 mt-2">{apiError}</p>}
            {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
          </div>
        </section>
      </div>
    </main>
  )
}

/*"use client"

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
*/