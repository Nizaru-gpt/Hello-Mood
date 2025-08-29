export function saveUser(u: { name: string; email: string; password: string }) {
  const raw = localStorage.getItem('mt_users')
  const users: Array<{ name: string; email: string; password: string }> = raw ? JSON.parse(raw) : []
  if (!users.find(x => x.email === u.email)) {
    users.push(u)
    localStorage.setItem('mt_users', JSON.stringify(users))
  }
}

export function authLogin(email: string, password: string): boolean {
  const raw = localStorage.getItem('mt_users')
  const users: Array<{ name: string; email: string; password: string }> = raw ? JSON.parse(raw) : []
  return users.some(u => u.email === email && u.password === password)
}


export function saveFirebaseUser(u: { uid: string; name: string | null; email: string | null; photo?: string | null }) {
  localStorage.setItem('mt_user_firebase', JSON.stringify(u))
}
