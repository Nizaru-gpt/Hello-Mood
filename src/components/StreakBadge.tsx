import { useMemo } from 'react'
import { useMoodStore } from '../store/moodStore'


function getCurrentStreak(entries: { date: string }[]): number {
  if (!entries?.length) return 0
  const set = new Set(entries.map(e => e.date))
  let streak = 0
  const d = new Date()
  while (true) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`
    if (set.has(key)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else break
  }
  return streak
}

export default function StreakBadge() {
  const entries = useMoodStore(s => s.entries)
  const streak = useMemo(() => getCurrentStreak(entries), [entries])

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-amber-800 shadow">
      <span>🔥</span>
      <span className="text-sm font-semibold">
        Streak {streak} {streak === 1 ? 'hari' : 'hari'}!
      </span>
    </div>
  )
}
