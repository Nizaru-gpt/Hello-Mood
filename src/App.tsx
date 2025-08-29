import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ReactNode, Suspense, lazy } from 'react'
import { useAuthStore } from './store/authStore'
import ErrorBoundary from './components/ErrorBoundary'


const Login    = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const AppHome  = lazy(() => import('./pages/AppHome'))
const Profile  = lazy(() => import('./pages/Profile'))

function Protected({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user)
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 24, color: '#475569' }}>Memuat…</div>}>
        <Routes>
          {/* root -> login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/app"
            element={
              <Protected>
                <ErrorBoundary>
                  <AppHome />
                </ErrorBoundary>
              </Protected>
            }
          />

          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
