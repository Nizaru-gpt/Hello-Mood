import { motion } from 'framer-motion'

type Props = {
  icon?: React.ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function AuthButton({
  icon,
  label,
  onClick,
  disabled = false,
  type = 'button',
}: Props) {
  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm flex items-center justify-center gap-3
        focus:outline-none focus:ring-2 focus:ring-violet-400
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'}`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </motion.button>
  )
}
