import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMoodStore, ratingMeta } from '../store/moodStore'
import type { MoodEntry, MoodRating } from '../types/mood'
import RatingPicker from './RatingPicker'
import { formatHuman } from '../utils/date'
import { setMascotRatingToday, acknowledgeMascotToday } from './MascotMood'

type DayCell = { y:number; m:number; d:number; inMonth:boolean; key:string }
const ymd = (y:number,m:number,d:number)=>`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`

function buildMonthGrid(view: Date): DayCell[] { 
  const y = view.getFullYear(), m = view.getMonth()+1
  const first = new Date(y, m-1, 1)
  const startIdx = (first.getDay()+6)%7
  const daysInMonth = new Date(y, m, 0).getDate()
  const prevDays = new Date(y, m-1, 0).getDate()
  const cells: DayCell[] = []
  for (let i=0;i<startIdx;i++){
    const d = prevDays - startIdx + 1 + i
    const mm = m-1<1?12:m-1, yy = m-1<1?y-1:y
    cells.push({ y:yy, m:mm, d, inMonth:false, key: ymd(yy,mm,d) })
  }
  for (let d=1; d<=daysInMonth; d++) cells.push({ y, m, d, inMonth:true, key: ymd(y,m,d) })
  while (cells.length<42){
    const last = cells[cells.length-1]
    const nd = new Date(last.y, last.m-1, last.d+1)
    cells.push({ y:nd.getFullYear(), m:nd.getMonth()+1, d:nd.getDate(), inMonth:false, key: ymd(nd.getFullYear(), nd.getMonth()+1, nd.getDate()) })
  }
  return cells
}

function todayKey() {
  const d = new Date()
  return ymd(d.getFullYear(), d.getMonth()+1, d.getDate())
}

export default function MoodCalendar() {
  const entries = useMoodStore(s => s.entries)
  const addMood = useMoodStore(s => s.addMood)
  const updateMood = useMoodStore(s => s.updateMood)
  const deleteMood = useMoodStore(s => s.deleteMood)

  const [view, setView] = useState(()=>new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [editing, setEditing] = useState<MoodEntry|null>(null)
  const [mode, setMode] = useState<'view'|'edit'>('view')

  const mapByDate = useMemo(()=>{
    const m = new Map<string, MoodEntry>()
    for (const e of entries) m.set(e.date, e)
    return m
  },[entries])

  const cells = useMemo(()=>buildMonthGrid(view),[view])
  const title = new Intl.DateTimeFormat('id-ID', { month:'long', year:'numeric' }).format(view)
  const tKey = todayKey()

  function openFor(dateStr: string) {
    const exist = mapByDate.get(dateStr)
    if (exist) { setEditing({ ...exist }); setMode('view') }
    else {
      setEditing({ id:'tmp', date:dateStr, rating:4, note:'', emotions:[], activities:[], energy:50, stress:50 })
      setMode('edit')
    }
  }

  function saveNewOrUpdate(e: MoodEntry) {
    if (mapByDate.get(e.date)) {
      updateMood(e.id, { rating: e.rating, note: e.note, emotions: e.emotions, activities: e.activities, energy: e.energy, stress: e.stress })
    } else {
      addMood({ date: e.date, rating: e.rating, note: e.note, emotions: e.emotions, activities: e.activities, energy: e.energy, stress: e.stress })
    }
    if (e.date === tKey) {
      setMascotRatingToday(e.rating as MoodRating)
      acknowledgeMascotToday()
    }
  }

  return (
    <div className="rounded-3xl bg-white p-4 shadow">
      {/* header bulan, nav, dsb — sama */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 grid place-items-center">📅</div>
          <div className="text-lg font-semibold text-slate-800">{title}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setView(v=>new Date(v.getFullYear(), v.getMonth()-1, 1))} className="rounded-full bg-slate-100 px-3 py-1 font-semibold hover:bg-slate-200">‹</button>
          <button onClick={()=>setView(v=>new Date(v.getFullYear(), v.getMonth()+1, 1))} className="rounded-full bg-slate-100 px-3 py-1 font-semibold hover:bg-slate-200">›</button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-slate-500">
        {['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(d => <div key={d}>{d}</div>)}
      </div>

      <motion.div layout className="grid grid-cols-7 gap-2">
        {cells.map(c=>{
          const k = c.key
          const e = mapByDate.get(k)
          const rating = e?.rating as MoodRating | undefined

          const face = rating ? ratingMeta[rating].emoji : '＋'
          const filledClass = rating
            ? ratingMeta[rating].bg
            : 'bg-slate-50 border border-dashed border-slate-300 text-slate-300'
          const hasNote = !!e?.note
          const isToday = k === tKey

          return (
            <motion.button
              key={k}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={()=>openFor(k)}
              className={`group relative aspect-square w-full rounded-full grid place-items-center shadow-sm ${filledClass} ${c.inMonth ? '' : 'opacity-50'}`}
              title={formatHuman(k)}
            >
              <div className={`text-xl ${rating ? '' : 'opacity-70 group-hover:opacity-100'}`}>{face}</div>
              {hasNote && <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />}
              {isToday && <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-indigo-400" />}
              <span className="absolute left-1 top-1 text-[10px] text-slate-500">{c.d}</span>
            </motion.button>
          )
        })}
      </motion.div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
            onClick={()=>setEditing(null)}
          >
            <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}}
              className="w-full max-w-md rounded-3xl bg-white p-4 shadow-xl"
              onClick={(e)=>e.stopPropagation()}
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">
                    {mapByDate.get(editing.date) && mode==='view' ? 'Detail Mood' : 'Simpan Mood'}
                  </h3>
                  <p className="text-xs text-slate-500">{formatHuman(editing.date)}</p>
                </div>
                <button onClick={()=>setEditing(null)} className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100">✕</button>
              </div>

              {mapByDate.get(editing.date) && mode==='view' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{ratingMeta[editing.rating as MoodRating].emoji}</div>
                    <div className="text-slate-600">{ratingMeta[editing.rating as MoodRating].label}</div>
                  </div>
                  {editing.note && <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{editing.note}</div>}
                  <div className="mt-4 flex justify-between">
                    <button className="rounded-xl border px-3 py-2 font-semibold text-rose-600 hover:bg-rose-50"
                      onClick={()=>{ const found = mapByDate.get(editing.date); if (found) deleteMood(found.id); setEditing(null) }}
                    >Hapus</button>
                    <button className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white" onClick={()=>setMode('edit')}>Ubah</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <RatingPicker value={editing.rating as MoodRating}
                    onChange={(r)=>setEditing(e => e ? { ...e, rating: r } : e)}
                  />
                  <textarea className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                    rows={3} placeholder="Catatan (opsional)…"
                    value={editing.note ?? ''} onChange={e=>setEditing(cur => cur ? { ...cur, note: e.target.value } : cur)}
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button className="rounded-xl border px-3 py-2 font-semibold" onClick={()=>setEditing(null)}>Batal</button>
                    <button className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white"
                      onClick={()=>{ if (!editing) return; saveNewOrUpdate(editing); setEditing(null); setMode('view') }}
                    >Simpan</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
