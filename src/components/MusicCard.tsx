import { Play, Pause, SkipBack, SkipForward, Shuffle, Clock, Check } from "lucide-react"

export default function MusicCard() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      {/* Judul dan artis */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-900 text-lg">Tarot</div>
          <div className="text-sm text-slate-500">Feast</div>
        </div>
        <div className="text-green-500">
          <Check className="h-6 w-6" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="relative h-1.5 w-full rounded-full bg-slate-200">
          <div className="absolute left-0 top-0 h-1.5 w-1/6 rounded-full bg-slate-800" />
          <div className="absolute left-[16%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-slate-800" />
        </div>
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>0:30</span>
          <span>4:48</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between text-slate-700">
        <Shuffle className="h-5 w-5 text-green-500" />
        <SkipBack className="h-6 w-6" />
        <button className="grid h-14 w-14 place-items-center rounded-full bg-slate-900 text-white">
          <Pause className="h-7 w-7" />
        </button>
        <SkipForward className="h-6 w-6" />
        <Clock className="h-5 w-5" />
      </div>
    </div>
  )
}
