import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import StreakBadge from './StreakBadge'
import { UserCircle } from 'lucide-react'

function getGreeting(d = new Date()) {
  const h = d.getHours()
  if (h >= 4 && h < 11) return 'Selamat Pagi!'
  if (h >= 11 && h < 15) return 'Selamat Siang!'
  if (h >= 15 && h < 18) return 'Selamat Sore!'
  return 'Selamat Malam!'
}

export default function TopBar() {
  const user = useAuthStore(s => s.user)
  const nav = useNavigate()

  const [now, setNow] = useState(() => new Date())
  const greeting = useMemo(() => getGreeting(now), [now])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      {/* Kiri: logo + nama (min-w-0 agar truncate berfungsi) */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl overflow-hidden ring-1 ring-white/25 bg-white/10 backdrop-blur">
          <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
        </div>

        {/* Teks dibatasi lebar + truncate */}
        <div className="leading-tight min-w-0">
          <div className="text-[10px] sm:text-xs text-indigo-200/90">{greeting}</div>
          <div
            className="
              text-white/95 font-semibold
              text-base sm:text-lg
              truncate
              max-w-[46vw] sm:max-w-[52vw] md:max-w-none
            "
            title={user?.name || 'Pengguna'}
          >
            {user?.name || 'Pengguna'}
          </div>
        </div>
      </div>

      {/* Kanan: streak (diperkecil di layar kecil) + tombol profil */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div className="scale-90 sm:scale-100 origin-right">
          <StreakBadge />
        </div>
        <button
          onClick={() => nav('/profile')}
          className="
            h-9 w-9 sm:h-10 sm:w-10 rounded-full
            bg-white/20 backdrop-blur text-white shadow-inner
            grid place-items-center hover:bg-white/30 transition
          "
          title="Profil"
          aria-label="Buka profil"
        >
          <UserCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </div>
  )
}
