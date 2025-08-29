import { motion } from 'framer-motion'
import { ratingMeta } from '../store/moodStore'
import type { MoodEntry } from '../types/mood'
import { formatHuman } from '../utils/date'

export default function MoodCard({ entry, onEdit, onDelete }: {
  entry: MoodEntry; onEdit: (e: MoodEntry) => void; onDelete: (id: string) => void
}) {
  const m = ratingMeta[entry.rating]
  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01 }}
      className="rounded-2xl bg-white p-4 shadow">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className={`h-11 w-11 rounded-xl grid place-items-center text-xl ${m.bg}`}>{m.emoji}</div>
          <div>
            <div className="font-semibold text-slate-800">{m.label}</div>
            <div className="text-xs text-slate-500">{formatHuman(entry.date)}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(entry)} className="rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-slate-50">Edit</button>
          <button onClick={() => onDelete(entry.id)} className="rounded-lg border px-3 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50">Hapus</button>
        </div>
      </div>
      {entry.note && <p className="mt-3 text-slate-700">{entry.note}</p>}
    </motion.div>
  )
}
