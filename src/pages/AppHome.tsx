import { useState } from 'react'
import { motion } from 'framer-motion'
import TopBar from '../components/TopBar'
import MusicCard from '../components/MusicCard'
import MoodForm from '../components/MoodForm'
import MoodList from '../components/MoodList'
import MoodCalendar from '../components/MoodCalendar'
import WeeklyView from '../components/WeeklyView'
import ChipMoods from '../components/ChipMoods'
import MascotMood, { acknowledgeMascotToday } from '../components/MascotMood'
import JournalPanel from '../components/JournalPanel'
import { useMoodStore } from '../store/moodStore'
import type { MoodRating } from '../types/mood'

export default function AppHome() {
  const [showForm, setShowForm] = useState(true)
  const [mode, setMode] = useState<'daily' | 'weekly'>('daily')
  const addMood = useMoodStore(s => s.addMood)

  function quickRate(r: MoodRating) {
    const d = new Date()
    const ymd = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    addMood({ date: ymd, rating: r, note: '' })
    acknowledgeMascotToday()
  }

  return (
    <div className="min-h-[100svh] relative">
      <div
        className="fixed inset-0 -z-10 bg-[#0f1531] bg-center bg-no-repeat bg-cover md:bg-contain pointer-events-none"
        style={{ backgroundImage: "url('/bg.png')" }}
        aria-hidden
      />
      <div className="mx-auto max-w-md px-4 sm:px-5 pt-8 pb-6">
        <TopBar />
        <MascotMood size={300} className="mt-4" />
        <div className="mt-1 mb-2">
          <ChipMoods onPick={quickRate} stacked />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-3xl bg-white p-4 shadow w-full max-w-full overflow-hidden"
        >
          <div className="mb-2 font-semibold text-slate-800">Rekomendasi Musik</div>
          <MusicCard />
        </motion.div>
      </div>

      <div className="mx-auto max-w-md rounded-t-[2rem] bg-[#faf7f2] px-4 sm:px-5 pb-24 pt-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xl font-bold text-slate-800">Pelacak Mood</div>
          <div className="flex items-center gap-1 rounded-full bg-slate-100 px-1 py-1 text-xs shrink-0">
            <button
              onClick={() => setMode('daily')}
              className={`rounded-full px-3 py-1 font-semibold ${mode==='daily' ? 'bg-white shadow' : 'text-slate-500'}`}
            >
              Harian
            </button>
            <button
              onClick={() => setMode('weekly')}
              className={`rounded-full px-3 py-1 font-semibold ${mode==='weekly' ? 'bg-white shadow' : 'text-slate-500'}`}
            >
              Mingguan
            </button>
          </div>
        </div>

        {mode === 'daily' ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mt-4 rounded-2xl bg-amber-200/80 p-4 text-slate-800 shadow w-full max-w-full"
            >
              <div className="font-semibold">Tambah mood harian</div>
              <div className="text-sm text-slate-600">Isi cepat mood + catatanmu hari ini.</div>
              <button
                onClick={() => setShowForm(v => !v)}
                className="mt-3 rounded-xl bg-amber-500 px-4 py-2 font-semibold text-white shadow hover:scale-[1.02] transition w-full sm:w-auto"
              >
                {showForm ? 'Sembunyikan formulir' : 'Tampilkan formulir'}
              </button>
              {showForm && (
                <div className="mt-3 rounded-2xl bg-white p-4 shadow w-full max-w-full min-w-0 overflow-x-hidden form-safe">
                  <MoodForm />
                </div>
              )}
            </motion.div>

            <div className="mt-4"><MoodCalendar /></div>

            {/* Jurnal Harian */}
            <div className="mt-4">
              <JournalPanel />
            </div>

            <div className="mt-5 grid gap-3"><MoodList /></div>
          </>
        ) : (
          <div className="mt-4">
            <WeeklyView />
          </div>
        )}
      </div>
    </div>
  )
}
