import { create } from 'zustand'

type User = { name: string; email: string; photo?: string } | null

type AuthState = {
  user: User
  login: (u: NonNullable<User>) => void
  logout: () => void
}

const LS_KEY = 'mt_user'

export const useAuthStore = create<AuthState>((set) => {
  const raw = localStorage.getItem(LS_KEY)
  const initial = raw ? (JSON.parse(raw) as User) : null
  return {
    user: initial,
    login: (u) => {
      localStorage.setItem(LS_KEY, JSON.stringify(u))
      set({ user: u })
    },
    logout: () => {
      localStorage.removeItem(LS_KEY)
      set({ user: null })
    },
  }
})
