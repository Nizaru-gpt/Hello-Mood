import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMoodStore } from '../store/moodStore'
import type { MoodRating } from '../types/mood'
import RatingPicker from './RatingPicker'
import { setMascotRatingToday, acknowledgeMascotToday } from './MascotMood'

const EMOTIONS = ['Tenang', 'Sedih', 'Marah', 'Takut', 'Senang']  
const ACTIVITIES = ['Membaca', 'Musik', 'Olahraga', 'Istirahat', 'Makan', 'Kerja']

export default function MoodForm() {
  const addMood = useMoodStore(s => s.addMood)
  const [rating, setRating] = useState<MoodRating>(4)
  const [emotions, setEmotions] = useState<string[]>([])
  const [activities, setActivities] = useState<string[]>([])
  const [energy, setEnergy] = useState(50)
  const [stress, setStress] = useState(50)
  const [note, setNote] = useState('')

  const toggle = (arr: string[], v: string, setArr: (x: string[]) => void) =>
    setArr(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const d = new Date()
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    addMood({ date, rating, emotions, activities, energy, stress, note })

    setMascotRatingToday(rating)
    acknowledgeMascotToday()

    setEmotions([]); setActivities([]); setEnergy(50); setStress(50); setNote('')
  }

  return (
    <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
      <div>
        <div className="mb-1 font-semibold text-slate-700">Mood</div>
        <RatingPicker value={rating} onChange={setRating} />
      </div>

      <div>
        <div className="mb-1 font-semibold text-slate-700">Emosi</div>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map(x => (
            <button
              key={x}
              type="button"
              onClick={() => toggle(emotions, x, setEmotions)}
              className={`px-3 py-1 rounded-full text-sm ${emotions.includes(x) ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 font-semibold text-slate-700">Aktivitas</div>
        <div className="flex flex-wrap gap-2">
          {ACTIVITIES.map(x => (
            <button
              key={x}
              type="button"
              onClick={() => toggle(activities, x, setActivities)}
              className={`px-3 py-1 rounded-full text-sm ${activities.includes(x) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm text-slate-600"><span>Energi</span><span>{energy}%</span></div>
        <input type="range" min={0} max={100} value={energy} onChange={e => setEnergy(+e.target.value)} className="w-full accent-indigo-500" />
      </div>
      <div>
        <div className="flex justify-between text-sm text-slate-600"><span>Stres</span><span>{stress}%</span></div>
        <input type="range" min={0} max={100} value={stress} onChange={e => setStress(+e.target.value)} className="w-full accent-rose-500" />
      </div>

      <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Tulis catatan..."
        className="w-full rounded-xl border p-2 text-sm focus:ring-2 focus:ring-indigo-400" />

      <button className="btn btn-primary">Simpan Mood</button>
    </motion.form>
  )
}
