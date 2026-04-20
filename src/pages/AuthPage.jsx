import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const emailRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        if (!username.trim()) { setError('Username is required'); setLoading(false); return }
        await signUp(email, password, username)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-in relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 border-2 border-brand-500 rotate-45" />
            <span className="font-display font-bold text-2xl tracking-[0.2em]">
              ESPORTS<span className="text-brand-500">MGR</span>
            </span>
          </div>
          <p className="text-dark-300 font-body text-sm tracking-widest uppercase">
            {mode === 'login' ? 'Welcome back, commander' : 'Create your command center'}
          </p>
        </div>

        {/* Card */}
        <div className="card border-dark-400">
          {/* Mode toggle */}
          <div className="flex bg-dark-700 rounded-lg p-1 mb-6">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 rounded-md font-display text-xs tracking-widest uppercase transition-all duration-200 ${
                  mode === m
                    ? 'bg-brand-500 text-dark-900'
                    : 'text-dark-300 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="label">Username</label>
                <input
                  className="input"
                  type="text"
                  placeholder="YourGamertag"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input
                ref={emailRef}
                className="input"
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg px-4 py-3 text-red-400 text-sm font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Enter Command Center' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
