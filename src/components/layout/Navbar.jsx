import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { to: '/',             label: 'Dashboard',   icon: '⬡' },
  { to: '/roster',       label: 'Roster',      icon: '◈' },
  { to: '/tournaments',  label: 'Tournaments', icon: '◉' },
  { to: '/analytics',    label: 'Analytics',   icon: '◈' },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 border-2 border-brand-500 rotate-45 group-hover:animate-glow-pulse transition-all" />
            <span className="font-display font-bold text-lg tracking-[0.2em] text-white group-hover:text-brand-400 transition-colors">
              ESPORTS<span className="text-brand-500">MGR</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-lg font-display text-xs tracking-widest uppercase transition-all duration-200 ${
                    active
                      ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                      : 'text-dark-300 hover:text-white hover:bg-dark-600'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-dark-300 font-body">
              {user?.user_metadata?.username || user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden pb-3 gap-1 overflow-x-auto">
          {navLinks.map(({ to, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-lg font-display text-xs tracking-widest uppercase whitespace-nowrap transition-all ${
                  active
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                    : 'text-dark-300 hover:text-white hover:bg-dark-600'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
