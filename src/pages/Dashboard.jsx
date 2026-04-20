import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePlayers } from '../hooks/usePlayers'
import { useTournaments } from '../hooks/useTournaments'
import StatCard from '../components/ui/StatCard'
import PlayerCard from '../components/ui/PlayerCard'

export default function Dashboard() {
  const { user } = useAuth()
  const { players, loading: pLoading } = usePlayers()
  const { tournaments, loading: tLoading } = useTournaments()

  const stats = useMemo(() => {
    const allMatches = tournaments.flatMap(t => t.matches || [])
    const wins   = allMatches.filter(m => m.result === 'win').length
    const losses = allMatches.filter(m => m.result === 'loss').length
    const total  = wins + losses
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0
    const totalKills = players.reduce((sum, p) => sum + (p.kills || 0), 0)
    const avgKD = players.length > 0
      ? (players.reduce((sum, p) => sum + (p.deaths > 0 ? p.kills / p.deaths : 0), 0) / players.length).toFixed(2)
      : '0.00'
    return { wins, losses, total, winRate, totalKills, avgKD }
  }, [players, tournaments])

  const recentMatches = useMemo(() => {
    return tournaments
      .flatMap(t => (t.matches || []).map(m => ({ ...m, tournamentName: t.name })))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
  }, [tournaments])

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Commander'

  if (pLoading || tLoading) return <LoadingScreen />

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <p className="text-dark-300 font-body text-sm tracking-widest uppercase mb-1">Welcome back</p>
        <h1 className="font-display font-bold text-4xl tracking-wider text-white">
          {username.toUpperCase()}
        </h1>
        <div className="mt-2 w-24 h-0.5 bg-brand-500" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Win Rate"     value={`${stats.winRate}%`} sub={`${stats.wins}W / ${stats.losses}L`} accent />
        <StatCard label="Roster Size"  value={players.length}     sub="active players" />
        <StatCard label="Tournaments"  value={tournaments.length} sub="registered" />
        <StatCard label="Team Avg K/D" value={stats.avgKD}        sub="kill/death ratio" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Matches */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Recent Matches</h2>
            <Link to="/tournaments" className="text-xs text-brand-500 hover:text-brand-400 font-display tracking-widest uppercase">
              View all →
            </Link>
          </div>
          {recentMatches.length === 0 ? (
            <EmptyState message="No matches logged yet" link="/tournaments" linkLabel="Add a tournament" />
          ) : (
            <div className="space-y-2">
              {recentMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg border border-dark-500">
                  <div>
                    <p className="font-body font-semibold text-white text-sm">{match.opponent || 'Unknown opponent'}</p>
                    <p className="text-xs text-dark-300">{match.tournamentName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {match.score && <span className="text-xs font-display text-dark-300">{match.score}</span>}
                    <span className={`badge border text-xs ${
                      match.result === 'win'
                        ? 'bg-brand-500/20 text-brand-400 border-brand-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}>
                      {match.result?.toUpperCase() || 'TBD'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="section-title mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/roster" className="flex items-center gap-3 p-3 bg-dark-700 hover:bg-dark-600 rounded-lg border border-dark-500 hover:border-brand-500/40 transition-all group">
                <span className="text-brand-400 font-display text-lg">+</span>
                <span className="font-body text-sm text-white group-hover:text-brand-400 transition-colors">Add Player</span>
              </Link>
              <Link to="/tournaments" className="flex items-center gap-3 p-3 bg-dark-700 hover:bg-dark-600 rounded-lg border border-dark-500 hover:border-brand-500/40 transition-all group">
                <span className="text-brand-400 font-display text-lg">+</span>
                <span className="font-body text-sm text-white group-hover:text-brand-400 transition-colors">New Tournament</span>
              </Link>
              <Link to="/analytics" className="flex items-center gap-3 p-3 bg-dark-700 hover:bg-dark-600 rounded-lg border border-dark-500 hover:border-brand-500/40 transition-all group">
                <span className="text-brand-400 font-display text-lg">▲</span>
                <span className="font-body text-sm text-white group-hover:text-brand-400 transition-colors">View Analytics</span>
              </Link>
            </div>
          </div>

          {/* Top players */}
          {players.length > 0 && (
            <div className="card">
              <h2 className="section-title mb-4">Top Fraggers</h2>
              <div className="space-y-2">
                {[...players]
                  .sort((a, b) => (b.kills || 0) - (a.kills || 0))
                  .slice(0, 3)
                  .map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className="font-display text-xs text-dark-300 w-4">{i + 1}</span>
                      <div className="w-7 h-7 rounded bg-dark-600 border border-dark-400 flex items-center justify-center font-display text-xs text-brand-400">
                        {p.username?.[0]?.toUpperCase()}
                      </div>
                      <span className="flex-1 font-body text-sm text-white">{p.username}</span>
                      <span className="font-display text-xs text-brand-400">{p.kills ?? 0} kills</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Roster preview */}
      {players.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Roster</h2>
            <Link to="/roster" className="text-xs text-brand-500 hover:text-brand-400 font-display tracking-widest uppercase">
              Manage →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {players.slice(0, 4).map(p => (
              <PlayerCard key={p.id} player={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="page-container">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card h-24 animate-pulse bg-dark-700" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card h-64 animate-pulse bg-dark-700" />
        <div className="card h-64 animate-pulse bg-dark-700" />
      </div>
    </div>
  )
}

function EmptyState({ message, link, linkLabel }) {
  return (
    <div className="text-center py-8">
      <p className="text-dark-300 font-body text-sm mb-3">{message}</p>
      {link && (
        <Link to={link} className="text-brand-500 hover:text-brand-400 text-xs font-display tracking-widest uppercase">
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}
