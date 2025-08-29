import { motion } from 'framer-motion'
import { ratingMeta } from '../store/moodStore'
import type { MoodRating } from '../types/mood'

export default function RatingPicker({
  value,
  onChange,
  className = '',
}: {
  value: MoodRating
  onChange: (r: MoodRating) => void
  className?: string
}) {
  const items: MoodRating[] = [1, 2, 3, 4, 5]

  return (
    <div
      className={[
        'grid grid-cols-3 gap-2',
        'w-full max-w-[360px]',
        className,
      ].join(' ')}
    >
      {items.map((r) => (
        <Chip key={r} r={r} active={value === r} onPick={onChange} />
      ))}
    </div>
  )
}

function Chip({
  r,
  active,
  onPick,
}: {
  r: MoodRating
  active: boolean
  onPick: (r: MoodRating) => void
}) {
  const m = ratingMeta[r]
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={() => onPick(r)}
      className={[
        'inline-flex items-center justify-center gap-1 rounded-lg shadow-sm transition-colors',
        // ukuran kecil biar muat 3 atas 2 bawah
        'px-2 py-1 text-xs',
        active
          ? 'bg-slate-300 text-slate-900'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
      ].join(' ')}
      aria-pressed={active}
      aria-label={m.label}
      title={m.label}
    >
      <span className="text-sm">{m.emoji}</span>
      <span className="truncate">{m.label}</span>
    </motion.button>
  )
}
