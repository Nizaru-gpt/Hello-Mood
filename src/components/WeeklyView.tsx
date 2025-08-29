import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useMoodStore, ratingMeta } from '../store/moodStore'
import type { MoodEntry, MoodRating } from '../types/mood'

type DayItem = { key: string; label: string; entry?: MoodEntry }

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function startOfWeek(d = new Date()) {
  const tmp = new Date(d)
  const dow = (tmp.getDay() + 6) % 7 
  tmp.setDate(tmp.getDate() - dow)
  tmp.setHours(0,0,0,0)
  return tmp
}

export default function WeeklyView() {
  const entries = useMoodStore(s => s.entries)

  const data = useMemo<{
    days: DayItem[]
    avg?: MoodRating
    total: number
  }>(() => {
    const start = startOfWeek()
    const map = new Map<string, MoodEntry>()
    for (const e of entries) map.set(e.date, e)

    const days: DayItem[] = []
    const labels = ['Sen','Sel','Rab','Kam','Jum','Sab','Min']
    const ratings: MoodRating[] = []

    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const key = ymd(d)
      const entry = map.get(key)
      if (entry) ratings.push(entry.rating as MoodRating)
      days.push({ key, label: labels[i], entry })
    }

    const total = ratings.length
    const avg = total
      ? (Math.round(ratings.reduce((a,b)=>a+b,0) / total) as MoodRating)
      : undefined

    return { days, avg, total }
  }, [entries])

  return (
    <div className="rounded-3xl bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100">📆</div>
          <div className="text-lg font-semibold text-slate-800">Ringkasan Mingguan</div>
        </div>
        <div className="text-sm text-slate-500">
          {data.total ? `${data.total}/7 hari terisi` : 'Belum ada entri minggu ini'}
        </div>
      </div>

      {/* Garis hari Sen–Min */}
      <div className="grid grid-cols-7 gap-2">
        {data.days.map((d, i) => {
          const r = d.entry?.rating as MoodRating | undefined
          const face = r ? ratingMeta[r].emoji : '＋'
          const tone = r ? 'bg-slate-50' : 'bg-slate-50'
          return (
            <motion.div
              key={d.key}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`flex flex-col items-center rounded-2xl ${tone} p-2 border border-slate-200`}
              title={d.key}
            >
              <div className="text-[11px] font-semibold text-slate-500">{d.label}</div>
              <div className="mt-1 grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-inner">
                {face}
              </div>
              {r && (
                <div className="mt-1 text-[11px] font-medium text-slate-600">
                  {ratingMeta[r].label}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Ringkasan rata-rata */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-3 text-center">
          <div className="text-xs text-slate-500">Rata-rata</div>
          <div className="mt-1 text-2xl">
            {data.avg ? ratingMeta[data.avg].emoji : '—'}
          </div>
          <div className="text-sm font-semibold">
            {data.avg ? ratingMeta[data.avg].label : '—'}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 text-center">
          <div className="text-xs text-slate-500">Hari Terisi</div>
          <div className="mt-1 text-2xl">{data.total}</div>
          <div className="text-sm font-semibold">dari 7</div>
        </div>
      </div>
    </div>
  )
}
