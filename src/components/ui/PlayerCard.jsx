import { Link } from 'react-router-dom'
import { useCallback } from 'react'

const ROLE_COLORS = {
  'IGL':     'bg-brand-500/20 text-brand-400 border-brand-500/40',
  'Rifler':  'bg-blue-500/20 text-blue-400 border-blue-500/40',
  'AWPer':   'bg-purple-500/20 text-purple-400 border-purple-500/40',
  'Support': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  'Lurker':  'bg-red-500/20 text-red-400 border-red-500/40',
  'Entry':   'bg-orange-500/20 text-orange-400 border-orange-500/40',
  'default': 'bg-dark-500/20 text-dark-300 border-dark-400',
}

export default function PlayerCard({ player, onDelete }) {
  const roleClass = ROLE_COLORS[player.role] || ROLE_COLORS.default
  const winRate = player.wins + player.losses > 0
    ? Math.round((player.wins / (player.wins + player.losses)) * 100)
    : 0

  const handleDelete = useCallback((e) => {
    e.preventDefault()
    if (window.confirm(`Remove ${player.username} from roster?`)) {
      onDelete(player.id)
    }
  }, [player.id, player.username, onDelete])

  return (
    <Link to={`/roster/${player.id}`} className="block">
      <div className="card-hover group relative overflow-hidden cursor-pointer">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-start justify-between mb-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-lg bg-dark-600 border border-dark-400 flex items-center justify-center font-display font-bold text-lg text-brand-400">
            {player.username?.[0]?.toUpperCase() || '?'}
          </div>
          <span className={`badge border ${roleClass}`}>{player.role || 'Unknown'}</span>
        </div>

        <h3 className="font-display font-bold text-white text-base tracking-wider mb-1">
          {player.username}
        </h3>
        <p className="text-xs text-dark-300 font-body mb-4">{player.game || 'No game set'}</p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-dark-400">
          <div className="text-center">
            <p className="font-display font-bold text-brand-400 text-sm">{player.kills ?? 0}</p>
            <p className="text-xs text-dark-300 uppercase tracking-wider">Kills</p>
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-white text-sm">
              {player.deaths > 0 ? (player.kills / player.deaths).toFixed(1) : '—'}
            </p>
            <p className="text-xs text-dark-300 uppercase tracking-wider">K/D</p>
          </div>
          <div className="text-center">
            <p className={`font-display font-bold text-sm ${winRate >= 50 ? 'text-brand-400' : 'text-red-400'}`}>
              {winRate}%
            </p>
            <p className="text-xs text-dark-300 uppercase tracking-wider">W/R</p>
          </div>
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-dark-300 hover:text-red-400 transition-all text-lg leading-none"
            title="Delete player"
          >
            ×
          </button>
        )}
      </div>
    </Link>
  )
}
