import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useMoodStore } from '../store/moodStore'
import type { MoodRating } from '../types/mood'

import imgMaskot from '../assets/maskot1.png'
import imgHappy from '../assets/calm.png'
import imgMad from '../assets/mad.png'
import imgSad from '../assets/sad.png'
import imgScary from '../assets/scary.png'
import imgExcited from '../assets/happy.png'

const LS_KEY = 'mascot.lastRating'
const SS_INTRO_SHOWN = 'mascot.introShown' 

type KeyTag = MoodRating | 'init'

const mascotMap: Record<KeyTag, string> = {
  init: imgMaskot,
  1: imgMad,
  2: imgSad,
  3: imgScary,
  4: imgHappy,
  5: imgExcited,
}

const scaleMap: Record<KeyTag, number> = {
  init: 1.10,
  1: 1.00,
  2: 1.00,
  3: 1.00,
  4: 1.00,
  5: 1.08,
}

function ymd(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export function setMascotRatingToday(r: MoodRating) {
  try { localStorage.setItem(LS_KEY, String(r)) } catch {}
}

export function acknowledgeMascotToday() {
  try { sessionStorage.setItem(SS_INTRO_SHOWN, '1') } catch {}
  try { window.dispatchEvent(new Event('mascot:ack')) } catch {}
}

export default function MascotMood({
  className = '',
  size = 260,
}: { className?: string; size?: number }) {
  const entries = useMoodStore(s => s.entries)

  const todayRatingFromEntries: MoodRating | null = useMemo(() => {
    if (!entries.length) return null
    const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1))
    const latest = sorted[0]
    return latest.date === ymd() ? latest.rating : null
  }, [entries])

  const readIntroShown = () => {
    try { return sessionStorage.getItem(SS_INTRO_SHOWN) === '1' } catch { return false }
  }

  const readLastRating = (): MoodRating | null => {
    try {
      const n = Number(localStorage.getItem(LS_KEY) || 0)
      return (n >= 1 && n <= 5) ? (n as MoodRating) : null
    } catch { return null }
  }

  const computeTag = (introAlreadyShown: boolean): KeyTag => {
    if (!introAlreadyShown) return 'init'                       
    if (todayRatingFromEntries != null) return todayRatingFromEntries
    const fromLS = readLastRating()
    return (fromLS ?? 'init') as KeyTag                         
  }

  const [introShown, setIntroShown] = useState<boolean>(readIntroShown())
  const [keyTag, setKeyTag] = useState<KeyTag>(computeTag(readIntroShown()))

  
  useEffect(() => {
    setKeyTag(computeTag(introShown))
  }, [introShown, todayRatingFromEntries])

  
  useEffect(() => {
    const h = () => setIntroShown(true)
    window.addEventListener('mascot:ack', h)
    return () => window.removeEventListener('mascot:ack', h)
  }, [])

  const src = mascotMap[keyTag]
  const visualScale = scaleMap[keyTag]

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <motion.div
        key={src}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative"
        style={{
          width: size,
          height: size,
          maxWidth: '90vw',
          maxHeight: '90vw',
        }}
      >
        <img
          src={src}
          alt="Mascot"
          className="absolute inset-0 m-auto select-none"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: `scale(${visualScale})`,
            transformOrigin: 'center bottom',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </div>
  )
}
