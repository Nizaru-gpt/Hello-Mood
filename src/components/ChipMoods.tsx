import { motion } from 'framer-motion'
import type { MoodRating } from '../types/mood'
import { ratingMeta } from '../store/moodStore'

export default function ChipMoods({
  onPick,
  stacked = true, 
}: {
  onPick: (r: MoodRating) => void
  stacked?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-3 w-full px-4 overflow-visible">
      {/* BARIS ATAS: 3 chip */}
      <div
        className="
          grid grid-cols-[auto_auto_auto] gap-x-4 justify-items-center
          w-full max-w-[620px] overflow-visible
        "
      >
        <MoodChip r={1} onPick={onPick} /> {/* Marah */}
        <MoodChip r={2} onPick={onPick} /> {/* Sedih */}
        <MoodChip r={3} onPick={onPick} /> {/* Takut */}
      </div>

      {/* BARIS BAWAH */}
      <div
        className="
          grid
          grid-cols-[1fr_auto_2rem_auto_1fr]           /* jarak tengah 2rem */
          sm:grid-cols-[1fr_auto_3rem_auto_1fr]        /* di sm+ jarak 3rem */
          justify-items-center w-full max-w-[620px] overflow-visible
        "
      >
        <div /> {/* spacer kiri */}
        <MoodChip r={4} onPick={onPick} /> {/* Tenang */}
        <div /> {/* spacer tengah */}
        <MoodChip r={5} onPick={onPick} /> {/* Senang */}
        <div /> {/* spacer kanan */}
      </div>
    </div>
  )
}

function MoodChip({ r, onPick }: { r: MoodRating; onPick: (r: MoodRating) => void }) {
  const m = ratingMeta[r]
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onPick(r)}
      className="
        inline-flex items-center justify-center gap-2
        rounded-2xl px-4 py-2 shadow-sm
        text-sm sm:text-base
        bg-slate-800/90 text-white hover:bg-slate-700
      "
      aria-label={m.label}
      title={m.label}
    >
      <span className="text-base sm:text-lg">{m.emoji}</span>
      <span className="font-semibold leading-none">{m.label}</span>
    </motion.button>
  )
}
