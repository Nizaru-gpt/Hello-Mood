import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMoodStore, ratingMeta } from '../store/moodStore'
import type { MoodEntry, MoodRating } from '../types/mood'
import { formatHuman } from '../utils/date'
import RatingPicker from './RatingPicker'

export default function MoodList() {
  const entries = useMoodStore((s) => s.entries)
  const deleteMood = useMoodStore((s) => s.deleteMood)
  const updateMood = useMoodStore((s) => s.updateMood)

  const [editing, setEditing] = useState<MoodEntry | null>(null)

  const list = useMemo(
    () =>
      [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)), 
    [entries]
  )

  return (
    <>
      <ul className="grid gap-3">
        {list.map((e) => (
          <li key={e.id} className="rounded-2xl bg-white p-4 shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-slate-800">{formatHuman(e.date)}</div>
                <div className="mt-1 text-2xl">{ratingMeta[e.rating].emoji}</div>
              </div>

              <div className="flex flex-col items-end gap-1 text-xs">
                {e.emotions?.length ? (
                  <div className="flex flex-wrap justify-end gap-1">
                    {e.emotions.slice(0, 3).map((x) => (
                      <span key={x} className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700">
                        {x}
                      </span>
                    ))}
                    {e.emotions.length > 3 && <span className="text-slate-400">+{e.emotions.length - 3}</span>}
                  </div>
                ) : null}

                {e.activities?.length ? (
                  <div className="flex flex-wrap justify-end gap-1">
                    {e.activities.slice(0, 3).map((x) => (
                      <span key={x} className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                        {x}
                      </span>
                    ))}
                    {e.activities.length > 3 && <span className="text-slate-400">+{e.activities.length - 3}</span>}
                  </div>
                ) : null}

                {(e.energy != null || e.stress != null) && (
                  <div className="flex gap-2">
                    {e.energy != null && <span title="Energi">⚡{e.energy}%</span>}
                    {e.stress != null && <span title="Stres">🧠{e.stress}%</span>}
                  </div>
                )}
              </div>
            </div>

            {e.note && <p className="mt-2 text-sm text-slate-600">{e.note}</p>}

            <div className="mt-3 flex gap-2">
              <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={() => setEditing({ ...e })}>
                Ubah
              </button>
              <button
                className="rounded-lg border px-3 py-1.5 text-sm text-rose-600"
                onClick={() => deleteMood(e.id)}
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
        {list.length === 0 && (
          <li className="rounded-2xl bg-white p-4 text-center text-sm text-slate-500 shadow">Belum ada entri mood.</li>
        )}
      </ul>

      {/* Modal Edit */}
      <AnimatePresence>
        {editing && (
          <EditSheet
            entry={editing}
            onChange={(p) => setEditing((cur) => (cur ? { ...cur, ...p } : cur))}
            onClose={() => setEditing(null)}
            onSave={() => {
              updateMood(editing.id, editing)
              setEditing(null)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ---------- Edit sheet untuk item list ---------- */
function EditSheet({
  entry,
  onChange,
  onClose,
  onSave,
}: {
  entry: MoodEntry
  onChange: (partial: Partial<MoodEntry>) => void
  onClose: () => void
  onSave: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-4 shadow-xl"
      >
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">Ubah Mood</h3>
            <p className="text-xs text-slate-500">{formatHuman(entry.date)}</p>
          </div>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <RatingPicker value={entry.rating as MoodRating} onChange={(r) => onChange({ rating: r })} />

          <MiniMulti
            title="Emosi"
            items={['Bahagia', 'Sedih', 'Marah', 'Takut', 'Senang']}
            color="indigo"
            value={entry.emotions || []}
            onToggle={(v) => onChange({ emotions: toggle(entry.emotions || [], v) })}
          />

          <MiniMulti
            title="Aktivitas"
            items={['Membaca', 'Musik', 'Olahraga', 'Istirahat', 'Makan', 'Kerja']}
            color="emerald"
            value={entry.activities || []}
            onToggle={(v) => onChange({ activities: toggle(entry.activities || [], v) })}
          />

          <Slider label="Energi" color="indigo" value={entry.energy ?? 50} onChange={(v) => onChange({ energy: v })} />
          <Slider label="Stres" color="rose" value={entry.stress ?? 50} onChange={(v) => onChange({ stress: v })} />

          <textarea
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
            rows={3}
            placeholder="Catatan (opsional)…"
            value={entry.note ?? ''}
            onChange={(e) => onChange({ note: e.target.value })}
          />

          <div className="mt-2 flex justify-end gap-2">
            <button className="rounded-xl border px-3 py-2 font-semibold" onClick={onClose}>
              Batal
            </button>
            <button className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white" onClick={onSave}>
              Simpan
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Helpers kecil ---------- */
function toggle(arr: string[], v: string) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
}

function MiniMulti({
  title,
  items,
  value,
  onToggle,
  color,
}: {
  title: string
  items: string[]
  value: string[]
  onToggle: (v: string) => void
  color: 'indigo' | 'emerald'
}) {
  const base = color === 'indigo' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
  const active = color === 'indigo' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'
  return (
    <div>
      <div className="mb-1 text-sm font-semibold text-slate-700">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((x) => (
          <button
            type="button"
            key={x}
            onClick={() => onToggle(x)}
            className={`rounded-full px-3 py-1 text-xs ${value.includes(x) ? active : base}`}
          >
            {x}
          </button>
        ))}
      </div>
    </div>
  )
}

function Slider({
  label,
  value,
  onChange,
  color,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  color: 'indigo' | 'rose'
}) {
  const accent = color === 'indigo' ? 'accent-indigo-500' : 'accent-rose-500'
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${accent}`}
      />
    </div>
  )
}
