"use client"

import React, { useState } from 'react'

// Small demo calendar component showing courses, dates and selectable time slots
const demoSessions = [
  {
    id: 's1',
    course: 'Formation 1',
    dates: [
      { date: '2025-10-02', slots: ['09:00', '14:00', '16:30', '18:00'] },
      { date: '2025-10-09', slots: ['09:00', '14:00'] },
      
      
    ],
  },
  {
    id: 's2',
    course: 'Formation 2',
    dates: [
      { date: '2025-10-20', slots: ['09:00', '14:00', '16:00', '18:00'] },
      { date: '2025-10-04', slots: ['10:00', '16:00'] },
      { date: '2025-10-12', slots: ['10:00', '16:00', '19:00'] },
      { date: '2025-11-25', slots: ['10:00', '15:00', '17:00'] },
    ],
  },
  {
    id: 's3',
    course: 'Formation 3',
    dates: [
      { date: '2025-10-03', slots: ['10:00', '16:00'] },
      { date: '2025-10-12', slots: ['10:00', '16:00', '19:00'] },
    ],
  },
  {
    id: 's4',
    course: 'Formation 4',
    dates: [
      { date: '2025-10-02', slots: ['10:00', '16:00'] },
      { date: '2025-10-12', slots: ['10:00', '16:00', '19:00'] },
    ],
  },
]

const Calendar = () => {
  const [sessions, setSessions] = useState<typeof demoSessions>(demoSessions)
  const [selectedSession, setSelectedSession] = useState<string | null>(demoSessions[0].id)
  const [selectedDate, setSelectedDate] = useState<string | null>(demoSessions[0].dates[0].date)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(demoSessions[0].dates[0].slots[0])

  // fetch live courses
  React.useEffect(()=>{
    let mounted = true
    fetch('/api/courses').then(r=>r.json()).then(j=>{
      if (!mounted) return
      if (j && j.success && Array.isArray(j.data) && j.data.length>0){
        // transform to demoSessions shape for display
        const mapped = j.data.map((c:any)=>({ id: c.id, course: c.title, dates: c.sessions.map((s:any)=>({ date: s.startDate.slice(0,10), slots: s.slots.map((sl:any)=>sl.time) })) }))
        setSessions(mapped)
        setSelectedSession(mapped[0]?.id ?? null)
        setSelectedDate(mapped[0]?.dates?.[0]?.date ?? null)
        setSelectedSlot(mapped[0]?.dates?.[0]?.slots?.[0] ?? null)
      }
    }).catch(()=>{
      // ignore and keep demoSessions
    })
    return ()=>{ mounted=false }
  },[])

  const session = sessions.find((s) => s.id === selectedSession)!

  const formatDate = (iso: string) => {
    // Expecting iso in YYYY-MM-DD, return DD/MM/YYYY for deterministic rendering
    const parts = iso.split('-')
    if (parts.length !== 3) return iso
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  return (
    <section id='calendar' className='bg-white py-12'>
      <div className='container'>
  <h2 className='text-midnight_text max-w-96 leading-12 lg:leading-14 mb-4'>Nos prochaines dates de formation</h2>
  <p className='text-black/70 mb-10 max-w-2xl'>Choisissez une formation, une date et un créneau disponible.</p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <h3 className='font-medium mb-2'>Formations</h3>
            <ul className='space-y-2'>
              {demoSessions.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      setSelectedSession(s.id)
                      setSelectedDate(s.dates[0].date)
                      setSelectedSlot(s.dates[0].slots[0])
                    }}
                    className={`w-full text-left p-2 rounded-lg border shadow-sm transition-all duration-300
  ${s.id === selectedSession
    ? 'bg-[#E0E2FF]/25 shadow-lg border-primary -translate-y-1'
    : 'border-black/10 hover:bg-[#E0E2FF]/25 hover:shadow-lg hover:border-primary hover:-translate-y-1'}`}>

                    {s.course}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='font-medium mb-2'>Dates disponibles</h3>
            <ul className='space-y-2'>
              {session.dates.map((d) => (
                <li key={d.date}>
                  <button
                    onClick={() => {
                      setSelectedDate(d.date)
                      setSelectedSlot(d.slots[0])
                    }}
                    className={`w-full text-left p-2 rounded border ${d.date === selectedDate ? 'bg-midnight_text/10 border-midnight_text' : 'border-gray-200'}`}>
                    {formatDate(d.date)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='font-medium mb-2'>Créneaux</h3>
            <div className='flex flex-wrap gap-2'>
              {session.dates.find((d) => d.date === selectedDate)?.slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-2 rounded border ${slot === selectedSlot ? 'bg-midnight_text/10 border-midnight_text' : 'border-gray-200'}`}>
                  {slot}
                </button>
              ))}
            </div>

            <div className='mt-6'>
              <p className='text-sm text-gray-700'>Sélection actuelle :</p>
              <p className='font-medium'>
                {session.course} — {selectedDate} @ {selectedSlot}
              </p>
              <button
                className='bg-primary text-white px-6 py-2 rounded-lg 
             transition-transform duration-300 hover:scale-105 hover:shadow-lg'
                onClick={() => alert(`Réservé: ${session.course} ${selectedDate} ${selectedSlot}`)}>
                Réserver ce créneau
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Calendar
