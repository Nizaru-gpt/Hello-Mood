import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { auth } from '../lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { saveFirebaseUser } from '../utils/auth'
import { Mail, Lock, User as UserIcon } from 'lucide-react'

export default function Register() {
  const nav = useNavigate()
  const login = useAuthStore(s => s.login)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    try {
      setError(''); setLoading(true)
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: name })
      saveFirebaseUser?.({ uid: user.uid, name, email: user.email, photo: user.photoURL })
      login({ name: name || user.email?.split('@')[0] || 'User', email: user.email || '', photo: user.photoURL || '' })
      nav('/app')
    } catch (e: any) {
      console.error(e)
      setError(e?.message || 'Gagal mendaftar')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[100svh] relative grid place-items-center">
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{ backgroundImage: "url('/bg.png')" }}
        aria-hidden
      />
      <div className="w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="card p-8 backdrop-blur-[1px]"
        >
          <div className="mb-6 text-center">
            <img src="/logo.png" alt="logo" className="mx-auto h-16 w-16" />
            <h1 className="mt-3 font-heading text-2xl font-extrabold text-slate-900">Daftar</h1>
            <p className="text-slate-600">Buat akun baru di Hello Mood</p>
          </div>

          <form onSubmit={handleRegister} className="grid gap-3">
            <div>
              <label className="label">Nama</label>
              <div className="relative">
                <input
                  className="input h-12 !pl-12"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <input
                  type="email"
                  className="input h-12 !pl-12"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="label">Kata sandi</label>
              <div className="relative">
                <input
                  type="password"
                  className="input h-12 !pl-12"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              </div>
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Memproses…' : 'Daftar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-violet-600 font-semibold hover:underline">Masuk di sini</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
