import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useMoodStore, ratingMeta } from '../store/moodStore'
import type { MoodEntry, MoodRating } from '../types/mood'
import { formatHuman } from '../utils/date'

const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

type RangeKey = '7' | '30' | 'all'

export default function JournalPanel() {
  const entries   = useMoodStore(s => s.entries)
  const addMood   = useMoodStore(s => s.addMood)
  const updateMood= useMoodStore(s => s.updateMood)

  const [date, setDate] = useState<string>(todayKey())
  const [text, setText] = useState<string>('')
  const [search, setSearch] = useState('')
  const [moodFilter, setMoodFilter] = useState<MoodRating | 'all'>('all')
  const [range, setRange] = useState<RangeKey>('30')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const exist = entries.find(e => e.date === date)
    setText(exist?.note ?? '')
  }, [date, entries])

  function save() {
    const exist = entries.find(e => e.date === date)
    if (exist) {
      updateMood(exist.id, { note: text })
    } else {
      const defaultRating: MoodRating = 4
      addMood({ date, rating: defaultRating, note: text })
    }
  }

  function clearNote(id: string) {
    updateMood(id, { note: '' })
    if (editingId === id) setEditingId(null)
    if (date === (entries.find(e => e.id === id)?.date ?? '')) setText('')
  }

  const filtered = useMemo(() => {
    const lower = search.trim().toLowerCase()
    const now = new Date()
    const after = (rk: RangeKey) => {
      if (rk === 'all') return new Date(0)
      const d = new Date(now)
      d.setDate(now.getDate() - (rk === '7' ? 7 : 30))
      return d
    }
    const cutoff = after(range)

    return [...entries]
      .filter(e => (e.note ?? '').trim().length > 0)
      .filter(e => {
        if (moodFilter !== 'all' && e.rating !== moodFilter) return false
        if (lower && !e.note!.toLowerCase().includes(lower)) return false
        const d = new Date(e.date)
        return d >= new Date(cutoff.getFullYear(), cutoff.getMonth(), cutoff.getDate())
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [entries, search, moodFilter, range])

  function exportTxt() {
    const lines = filtered.map(e => `[${formatHuman(e.date)}] ${ratingMeta[e.rating].label}\n${e.note}\n`)
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `journal-${todayKey()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-2xl bg-white p-4 shadow"
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="text-lg font-bold text-slate-800">Jurnal Harian</div>
        <div className="text-xs text-slate-500">Catatan cepat per hari</div>
      </div>

      {/* Composer */}
      <div className="rounded-xl border border-slate-200 p-3">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="rounded-lg border px-2 py-1 text-sm"
          />
          <span className="text-xs text-slate-400">({formatHuman(date)})</span>
        </div>
        <textarea
          rows={4}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Tulis cerita harimu di sini…"
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">{text.length} karakter</div>
          <div className="flex gap-2">
            <button
              onClick={() => setText('')}
              className="rounded-xl border px-3 py-2 text-sm font-semibold"
            >
              Bersihkan
            </button>
            <button
              onClick={save}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-105 active:scale-95"
            >
              Simpan Jurnal
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mt-4 grid gap-3">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari kata di catatan…"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMoodFilter('all')}
              className={`rounded-full px-3 py-1 text-xs ${moodFilter === 'all' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Semua
            </button>
            {( [1,2,3,4,5] as MoodRating[] ).map(r => (
              <button
                key={r}
                onClick={() => setMoodFilter(r)}
                className={`rounded-full px-3 py-1 text-xs flex items-center gap-1 ${
                  moodFilter === r ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
                title={ratingMeta[r].label}
              >
                <span>{ratingMeta[r].emoji}</span>
                <span className="hidden sm:inline">{ratingMeta[r].label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {(['7','30','all'] as RangeKey[]).map(k => (
              <button
                key={k}
                onClick={() => setRange(k)}
                className={`rounded-full px-3 py-1 text-xs ${range===k ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {k === 'all' ? 'Semua' : `${k} hari`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Header list + actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {filtered.length} catatan ditemukan
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportTxt}
            className="rounded-xl border px-3 py-1.5 text-sm"
            title="Ekspor sebagai TXT"
          >
            Ekspor TXT
          </button>
        </div>
      </div>

      {/* List */}
      <ul className="mt-2 grid gap-2">
        {filtered.length === 0 && (
          <li className="rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">
            Tidak ada catatan sesuai filter.
          </li>
        )}

        {filtered.map(e => (
          <li key={e.id} className="rounded-xl bg-slate-50 p-3">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{ratingMeta[e.rating].emoji}</span>
                <div className="text-xs text-slate-500">{formatHuman(e.date)}</div>
              </div>
              <div className="flex gap-1">
                {editingId !== e.id ? (
                  <>
                    <button
                      className="rounded-lg px-2 py-1 text-xs hover:bg-white"
                      onClick={() => setEditingId(e.id)}
                    >
                      Ubah
                    </button>
                    <button
                      className="rounded-lg px-2 py-1 text-xs text-rose-600 hover:bg-white"
                      onClick={() => clearNote(e.id)}
                      title="Hapus hanya catatannya (entri mood tetap ada)"
                    >
                      Hapus
                    </button>
                    <button
                      className="rounded-lg px-2 py-1 text-xs hover:bg-white"
                      onClick={() => navigator.clipboard.writeText(e.note || '')}
                    >
                      Salin
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="rounded-lg px-2 py-1 text-xs text-emerald-700 hover:bg-white"
                      onClick={() => { updateMood(e.id, { note: e.note }); setEditingId(null) }}
                    >
                      Simpan
                    </button>
                    <button
                      className="rounded-lg px-2 py-1 text-xs hover:bg-white"
                      onClick={() => setEditingId(null)}
                    >
                      Batal
                    </button>
                  </>
                )}
              </div>
            </div>

            {editingId === e.id ? (
              <textarea
                rows={3}
                value={e.note || ''}
                onChange={(ev) => updateMood(e.id, { note: ev.target.value })}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
              />
            ) : (
              <div className="whitespace-pre-wrap text-sm text-slate-700">{e.note}</div>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
