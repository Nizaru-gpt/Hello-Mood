import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import AuthButton from '../components/AuthButton'
import { useAuthStore } from '../store/authStore'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'
import { saveFirebaseUser } from '../utils/auth'
import { Mail } from 'lucide-react'

export default function Login() {
  const nav = useNavigate()
  const login = useAuthStore(s => s.login)

  const [showEmail, setShowEmail] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // handle login via Google
  async function handleGoogle() {
    try {
      setError(''); setLoading(true)
      const res = await signInWithPopup(auth, googleProvider)
      const u = res.user
      saveFirebaseUser?.({ uid: u.uid, name: u.displayName, email: u.email, photo: u.photoURL })
      login({ name: u.displayName || 'User', email: u.email || '', photo: u.photoURL || '' })
      nav('/app')
    } catch (e: any) {
      console.error(e)
      setError(e?.message || 'Gagal login Google')
    } finally { setLoading(false) }
  }

  // handle login via Email & Password
  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault()
    try {
      setError(''); setLoading(true)
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      login({ name: user.displayName || email.split('@')[0], email: user.email || '', photo: user.photoURL || '' })
      nav('/app')
    } catch (e: any) {
      console.error(e)
      setError('Email atau kata sandi salah / belum terdaftar')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[100svh] relative grid place-items-center">
      {/* background halaman */}
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{ backgroundImage: "url('/bg.png')" }}
        aria-hidden
      />

      {/* kartu login */}
      <div className="w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="card p-8 backdrop-blur-[1px]"
        >
          <div className="mb-6 text-center">
            <img src="/logo.png" alt="logo" className="mx-auto h-16 w-16" />
            <h1 className="mt-3 font-heading text-2xl font-extrabold text-slate-900">Masuk</h1>
            <p className="text-slate-600">Selamat datang kembali di Hello Mood</p>
          </div>

          <div className="grid gap-3">
            <AuthButton
              label={loading ? 'Memproses…' : 'Masuk dengan Google'}
              icon={<img src="/google.svg" alt="Google" className="h-5 w-5" />}
              onClick={handleGoogle}
              disabled={loading}
            />
            <AuthButton
              label={showEmail ? 'Sembunyikan formulir email' : 'Lanjut dengan email'}
              icon={<Mail className="h-5 w-5 text-slate-500" />}
              onClick={() => setShowEmail(v => !v)}
            />
          </div>

          <AnimatePresence>
            {showEmail && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="mt-4 grid gap-3 overflow-hidden"
              >
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label className="label">Kata sandi</label>
                  <input
                    type="password"
                    className="input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                {error && <p className="text-sm text-rose-600">{error}</p>}

                <button className="btn btn-primary" disabled={loading}>
                  {loading ? 'Memproses…' : 'Masuk'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-6 text-center text-sm text-slate-600">
            Belum punya akun?{' '}
            <Link to="/register" className="text-violet-600 font-semibold hover:underline">Daftar di sini</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
