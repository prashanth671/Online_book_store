import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const { login, loading, user } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  useEffect(() => { if (user) navigate('/') }, [user, navigate])

  const handle = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const fillDemo = (type) => {
    setError('')
    setForm(type === 'admin'
      ? { email: 'admin@bookstore.com', password: 'admin123' }
      : { email: 'john@example.com',    password: 'password123' }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await login(form.email, form.password)
    if (res.success) {
      success('Welcome back!')
      navigate('/')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md fade-up">
        {/* Card */}
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-2xl">📚</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your BookStore account</p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">🚀 Demo Accounts</p>
            <div className="flex gap-2">
              <button onClick={() => fillDemo('user')}
                className="flex-1 text-xs py-2 px-3 bg-white border border-indigo-200 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                👤 User
              </button>
              <button onClick={() => fillDemo('admin')}
                className="flex-1 text-xs py-2 px-3 bg-white border border-indigo-200 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                🛡️ Admin
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <input
                type="email" required autoComplete="email"
                value={form.email} onChange={handle('email')}
                placeholder="you@example.com"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required autoComplete="current-password"
                  value={form.password} onChange={handle('password')}
                  placeholder="••••••••"
                  className="input pr-11"
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-sm">
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full mt-2">
              {loading
                ? <span className="flex items-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Signing in…</span>
                : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
