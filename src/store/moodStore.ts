import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { MoodEntry, MoodRating } from '../types/mood'

export const ratingMeta: Record<
  MoodRating,
  { emoji: string; label: string; bg: string; isNegative: boolean }
> = {
  1: { emoji: '😡', label: 'Marah',  bg: 'bg-orange-100',  isNegative: true },
  2: { emoji: '☹️', label: 'Sedih',  bg: 'bg-blue-100',    isNegative: true },
  3: { emoji: '😨', label: 'Takut',  bg: 'bg-violet-100',  isNegative: true },
  4: { emoji: '🙂', label: 'Tenang', bg: 'bg-green-100',   isNegative: false },
  5: { emoji: '😋', label: 'Senang', bg: 'bg-emerald-100', isNegative: false },
}

type State = {
  entries: MoodEntry[]
  addMood: (e: Omit<MoodEntry, 'id'>) => void
  updateMood: (id: string, e: Partial<MoodEntry>) => void
  deleteMood: (id: string) => void
}

export const useMoodStore = create<State>()(
  persist(
    (set) => ({
      entries: [],
      addMood: (e) =>
        set((s) => {
          const idx = s.entries.findIndex((x) => x.date === e.date)
          if (idx >= 0) {
            const updated = [...s.entries]
            updated[idx] = { ...updated[idx], ...e }
            return { entries: updated }
          }
          return { entries: [...s.entries, { id: nanoid(), ...e }] }
        }),
      updateMood: (id, e) =>
        set((s) => ({
          entries: s.entries.map((x) => (x.id === id ? { ...x, ...e } : x)),
        })),
      deleteMood: (id) =>
        set((s) => ({ entries: s.entries.filter((x) => x.id !== id) })),
    }),
    { name: 'mood-tracker-data' }
  )
)
