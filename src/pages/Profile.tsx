import { useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useMoodStore, ratingMeta } from '../store/moodStore'
import type { MoodEntry, MoodRating } from '../types/mood'

function Avatar({ src, alt, onEdit }: { src?: string; alt: string; onEdit: () => void }) {
  return (
    <div className="relative h-28 w-28">
      <div className="h-full w-full overflow-hidden rounded-full border-4 border-white shadow-xl ring-4 ring-blue-100 bg-white">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-slate-400">
            <svg viewBox="0 0 24 24" className="h-14 w-14">
              <path
                fill="currentColor"
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z"
              />
            </svg>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onEdit}
        title="Edit profil"
        className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white shadow-lg ring-2 ring-white active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path
            fill="currentColor"
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18.71-11.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.99-1.66Z"
          />
        </svg>
      </button>
    </div>
  )
}

function currentStreak(entries: { date: string }[]) {
  if (!entries.length) return 0
  const set = new Set(entries.map(e => e.date))
  let s = 0
  const d = new Date()
  while (true) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (set.has(key)) { s++; d.setDate(d.getDate() - 1) } else break
  }
  return s
}

function bestStreak(entries: { date: string }[]) {
  if (!entries.length) return 0
  const dates = [...new Set(entries.map(e => e.date))].sort()
  let best = 1, cur = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curDate = new Date(dates[i])
    prev.setDate(prev.getDate() + 1)
    if (
      prev.getFullYear() === curDate.getFullYear() &&
      prev.getMonth() === curDate.getMonth() &&
      prev.getDate() === curDate.getDate()
    ) {
      cur++
    } else {
      best = Math.max(best, cur)
      cur = 1
    }
  }
  return Math.max(best, cur)
}

function daysFilledThisMonth(entries: { date: string }[]) {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  const set = new Set(
    entries
      .filter(e => {
        const [yy, mm] = e.date.split('-').map(Number)
        return yy === y && mm === m
      })
      .map(e => e.date)
  )
  const daysInMonth = new Date(y, m, 0).getDate()
  return { filled: set.size, daysInMonth }
}

export default function Profile() {
  const { user, login } = useAuthStore()
  const entries = useMoodStore(s => s.entries)

  const [tab, setTab] = useState<'riwayat' | 'statistik' | 'pencapaian'>('riwayat')
  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [photo, setPhoto] = useState(user?.photo ?? '')
  const fileRef = useRef<HTMLInputElement>(null)

  const total = entries.length
  const streak = useMemo(() => currentStreak(entries), [entries])
  const best = useMemo(() => bestStreak(entries), [entries])
  const monthInfo = useMemo(() => daysFilledThisMonth(entries), [entries])

  const counts = useMemo(() => {
    const c: Record<MoodRating, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const e of entries) c[e.rating]++
    return c
  }, [entries])

  const dominantKey: MoodRating | null = useMemo(() => {
    const sorted = (Object.entries(counts) as [string, number][])
      .sort((a, b) => b[1] - a[1])
    if (!sorted.length || sorted[0][1] === 0) return null
    return Number(sorted[0][0]) as MoodRating
  }, [counts])

  const dominantMeta = dominantKey ? ratingMeta[dominantKey] : undefined
  const moodAverageLabel = dominantMeta?.label ?? 'Belum ada'

  const recent = useMemo<MoodEntry[]>(
    () => [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6),
    [entries]
  )

  function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    login({
      name: name || user?.email?.split('@')[0] || 'Pengguna',
      email: user?.email || '',
      photo,
    })
    setEditOpen(false)
  }

  function onPickFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(String(reader.result || ''))
    reader.readAsDataURL(f)
  }

  const suggestion = useMemo(() => {
    const key = moodAverageLabel.toLowerCase()
    if (key === 'sedih') {
      return 'Sedih itu wajar. Coba tarik napas dalam, journaling 5 menit, atau dengarkan musik yang menenangkan.'
    }
    if (key === 'marah') {
      return 'Ambil jeda 5 menit. Lakukan pernapasan 4-7-8 atau jalan sebentar sebelum lanjut aktivitas.'
    }
    if (key === 'takut') {
      return 'Mulai dari langkah kecil. Tulis kekhawatiranmu lalu rencanakan satu aksi sederhana untuk hari ini.'
    }
    return ''
  }, [moodAverageLabel])

  const last7 = useMemo(() => {
    const map = new Map(entries.map(e => [e.date, e.rating]))
    const out: { key: string; rating?: MoodRating }[] = []
    const d = new Date()
    for (let i = 6; i >= 0; i--) {
      const dd = new Date(d)
      dd.setDate(d.getDate() - i)
      const k = `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}-${String(dd.getDate()).padStart(2, '0')}`
      out.push({ key: k, rating: map.get(k) as MoodRating | undefined })
    }
    return out
  }, [entries])

  return (
    <div className="min-h-[100svh] relative overflow-x-hidden">
      <div
        className="fixed inset-0 -z-10 bg-[#0f1531] bg-center bg-no-repeat bg-cover pointer-events-none"
        style={{ backgroundImage: "url('/bg.png')" }}
        aria-hidden
      />
      <div className="relative">
        <div
          className="absolute inset-x-0 top-0 -z-[1] h-64 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0) 100%)',
          }}
          aria-hidden
        />
      </div>

      <div className="relative mx-auto max-w-md px-6 pt-6">
        <div className="flex items-center justify-between">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-slate-800 shadow hover:brightness-105 active:scale-95"
            title="Kembali ke Beranda"
          >
            <span className="text-lg">←</span>
            <span className="text-sm font-semibold">Beranda</span>
          </Link>
          <div />
        </div>

        <div className="mt-4 flex flex-col items-center">
          <Avatar src={photo || user?.photo || ''} alt={user?.name || 'User'} onEdit={() => setEditOpen(true)} />

          <h1 className="mt-3 text-center font-heading text-2xl font-extrabold text-white drop-shadow">
            {user?.name || user?.email?.split('@')[0] || 'Pengguna'}
          </h1>
          <p className="text-sm text-white/85">{user?.email}</p>

          <div className="mt-5 grid w-full grid-cols-3 gap-3">
            <Stat icon="📘" value={total} label="Total entri" />
            <Stat icon="🔥" value={streak} label="Streak" />
            <Stat icon="🌈" value={moodAverageLabel} label="Rata-rata" />
          </div>

          {suggestion && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mt-4 w-full rounded-2xl bg-white/90 p-4 text-sm text-slate-700 shadow"
            >
              <div className="mb-1 font-semibold">💡 Saran untukmu</div>
              <p>{suggestion}</p>
            </motion.div>
          )}
        </div>

        <div className="mt-7">
          <div className="flex rounded-2xl bg-white p-1 shadow">
            {[
              { id: 'riwayat', label: 'Riwayat', icon: '📘' },
              { id: 'statistik', label: 'Statistik', icon: '📊' },
              { id: 'pencapaian', label: 'Pencapaian', icon: '🏆' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  tab === t.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <span className="mr-1">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pb-24">
          <AnimatePresence mode="wait">
            {tab === 'riwayat' && (
              <motion.div
                key="r"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mt-6 grid grid-cols-2 gap-4"
              >
                {recent.length === 0 ? (
                  <div className="col-span-2 rounded-2xl bg-white p-6 text-center text-slate-500 shadow">
                    Belum ada entri
                  </div>
                ) : (
                  recent.map((e, i) => <MoodTile key={e.id} e={e} i={i} />)
                )}
              </motion.div>
            )}

            {tab === 'statistik' && (
              <motion.div
                key="s"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mt-6 space-y-6"
              >
                <div className="rounded-2xl bg-white p-6 text-center shadow">
                  <div className="mb-2 text-lg font-bold text-slate-800">Rata-rata Mood</div>
                  <div className="mx-auto grid max-w-xs place-items-center gap-2">
                    <div className="text-6xl">{dominantMeta?.emoji ?? '🙂'}</div>
                    <div className="text-sm text-slate-600">Dominan akhir-akhir ini</div>
                    <div className="text-2xl font-extrabold text-slate-900">{moodAverageLabel}</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow">
                  <div className="mb-3 text-sm font-semibold text-slate-800">Distribusi Rating</div>
                  <div className="space-y-3">
                    {(Object.keys(ratingMeta) as unknown as MoodRating[]).map(r => {
                      const meta = ratingMeta[r]
                      const n = counts[r]
                      const pct = total ? Math.round((n / total) * 100) : 0
                      return (
                        <div key={r} className="grid grid-cols-[56px,1fr,44px] items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{meta.emoji}</span>
                            <span className="text-sm font-medium text-slate-700">{meta.label}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-violet-600"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="text-xs tabular-nums text-slate-600">{pct}%</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow">
                  <div className="mb-3 text-sm font-semibold text-slate-800">Aktivitas</div>
                  <div className="grid grid-cols-2 gap-3">
                    <MiniStat label="Total entri" value={String(total)} />
                    <MiniStat label="Streak saat ini" value={String(streak)} />
                    <MiniStat label="Streak terbaik" value={String(best)} />
                    <MiniStat label="Hari terisi (bulan ini)" value={`${monthInfo.filled}/${monthInfo.daysInMonth}`} />
                  </div>
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold text-slate-700">7 hari terakhir</div>
                    <div className="flex items-center gap-2">
                      {last7.map(d => (
                        <div
                          key={d.key}
                          className={`grid h-9 w-9 place-items-center rounded-full text-lg ${
                            d.rating ? 'bg-slate-100' : 'bg-slate-50 border border-dashed border-slate-300 text-slate-400'
                          }`}
                          title={d.key}
                        >
                          <span>{d.rating ? ratingMeta[d.rating].emoji : '＋'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SmallStat icon="⭐" label="Rata-rata" value={moodAverageLabel} />
                  <SmallStat icon="📅" label="Streak" value={streak.toString()} />
                </div>
              </motion.div>
            )}

            {tab === 'pencapaian' && (
              <motion.div
                key="p"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mt-6 space-y-4"
              >
                {[
                  { icon: '🎯', title: 'Pencatat Konsisten', desc: 'Catat mood 7 hari berturut-turut', progress: Math.min(streak, 7), target: 7 },
                  { icon: '📊', title: '50 Entri', desc: 'Capai 50 entri mood', progress: Math.min(total, 50), target: 50 },
                  { icon: '🌈', title: 'Eksplorasi Emosi', desc: 'Rasakan semua rating (1–5)', progress: Math.min(Object.keys(ratingMeta).length, 5), target: 5 },
                ].map((a, i) => (
                  <div key={a.title} className="rounded-2xl bg-white p-4 shadow">
                    <div className="mb-1 flex items-center gap-3">
                      <div className="text-2xl">{a.icon}</div>
                      <div className="font-semibold text-slate-800">{a.title}</div>
                    </div>
                    <div className="mb-2 text-sm text-slate-600">{a.desc}</div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(a.progress / a.target) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-6"
            onClick={() => setEditOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={saveProfile}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-lg font-bold">Edit Profil</div>
                <button type="button" onClick={() => setEditOpen(false)} className="rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100">
                  ✕
                </button>
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-full border">
                  {photo ? (
                    <img src={photo} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-slate-400">
                      <svg viewBox="0 0 24 24" className="h-8 w-8">
                        <path
                          fill="currentColor"
                          d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="rounded-lg border px-3 py-2 text-sm font-semibold"
                  >
                    Unggah dari galeri
                  </button>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto('')}
                      className="rounded-lg border px-3 py-2 text-sm font-semibold text-rose-600"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickFile}
                />
              </div>

              <label className="text-sm text-slate-600">Nama</label>
              <input className="input mt-1" value={name} onChange={e => setName(e.target.value)} />

              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setEditOpen(false)} className="rounded-xl border px-4 py-2 font-semibold">
                  Batal
                </button>
                <button className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">
                  Simpan
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Stat({ icon, value, label }: { icon: string; value: number | string; label: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow h-28 flex flex-col items-center justify-center">
      <span className="text-3xl leading-none select-none">{icon}</span>
      <div className="leading-tight text-center mt-1">
        <div className="text-lg font-extrabold text-slate-900">{value}</div>
        <div className="text-xs font-medium text-slate-500">{label}</div>
      </div>
    </div>
  )
}

function MoodTile({ e, i }: { e: MoodEntry; i: number }) {
  const meta = ratingMeta[e.rating]
  return (
    <motion.div
      initial={{ y: 12, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.06 }}
      className="rounded-2xl bg-white p-2 shadow"
    >
      <div className={`flex h-32 items-center justify-center rounded-xl ${meta.bg}`}>
        <div className="text-5xl">{meta.emoji}</div>
      </div>
      <div className="mt-2 px-1">
        <div className="text-sm font-semibold text-slate-800">{e.date}</div>
        {e.note && <div className="truncate text-xs text-slate-500">{e.note}</div>}
      </div>
    </motion.div>
  )
}

function SmallStat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
      <div className="text-xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}
