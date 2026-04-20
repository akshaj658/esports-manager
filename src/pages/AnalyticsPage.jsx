import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, CartesianGrid, Legend,
} from 'recharts'
import { usePlayers } from '../hooks/usePlayers'
import { useTournaments } from '../hooks/useTournaments'
import StatCard from '../components/ui/StatCard'

const COLORS = ['#00e566', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-700 border border-dark-400 rounded-lg px-3 py-2 text-xs font-body">
      {label && <p className="text-dark-300 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' && !Number.isInteger(p.value) ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { players, loading: pLoading } = usePlayers()
  const { tournaments, loading: tLoading } = useTournaments()

  const stats = useMemo(() => {
    const allMatches = tournaments.flatMap(t => t.matches || [])
    const wins   = allMatches.filter(m => m.result === 'win').length
    const losses = allMatches.filter(m => m.result === 'loss').length
    const total  = wins + losses
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0

    const totalKills  = players.reduce((s, p) => s + (p.kills  || 0), 0)
    const totalDeaths = players.reduce((s, p) => s + (p.deaths || 0), 0)
    const teamKD = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : '0.00'

    return { wins, losses, total, winRate, totalKills, totalDeaths, teamKD }
  }, [players, tournaments])

  // Player kills bar chart data
  const playerKillsData = useMemo(() =>
    [...players]
      .sort((a, b) => (b.kills || 0) - (a.kills || 0))
      .slice(0, 8)
      .map(p => ({ name: p.username, kills: p.kills || 0, deaths: p.deaths || 0, assists: p.assists || 0 })),
    [players])

  // Win rate per player
  const playerWinRateData = useMemo(() =>
    players
      .filter(p => (p.wins || 0) + (p.losses || 0) > 0)
      .map(p => ({
        name: p.username,
        winRate: Math.round((p.wins / (p.wins + p.losses)) * 100),
      }))
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 8),
    [players])

  // Role distribution pie
  const roleData = useMemo(() => {
    const counts = {}
    players.forEach(p => {
      counts[p.role || 'Unknown'] = (counts[p.role || 'Unknown'] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [players])

  // Tournament W/L
  const tournamentData = useMemo(() =>
    tournaments.map(t => ({
      name: t.name.length > 14 ? t.name.slice(0, 14) + '…' : t.name,
      wins:   (t.matches || []).filter(m => m.result === 'win').length,
      losses: (t.matches || []).filter(m => m.result === 'loss').length,
    })),
    [tournaments])

  const loading = pLoading || tLoading

  if (loading) return (
    <div className="page-container">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-dark-700" />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="card h-64 animate-pulse bg-dark-700" />)}
      </div>
    </div>
  )

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title text-2xl mb-1">Analytics</h1>
        <p className="text-dark-300 font-body text-sm">Team performance overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Overall Win Rate" value={`${stats.winRate}%`} sub={`${stats.wins}W / ${stats.losses}L`} accent />
        <StatCard label="Total Matches"    value={stats.total}         sub="across all tournaments" />
        <StatCard label="Team K/D"         value={stats.teamKD}        sub={`${stats.totalKills} kills`} />
        <StatCard label="Roster"           value={players.length}      sub="active players" />
      </div>

      {players.length === 0 && tournaments.length === 0 ? (
        <div className="card text-center py-20">
          <p className="font-display text-dark-300 tracking-widest mb-2">NO DATA YET</p>
          <p className="text-dark-300 font-body text-sm">Add players and log matches to see analytics.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Player Kills */}
          {playerKillsData.length > 0 && (
            <div className="card">
              <h2 className="font-display text-sm tracking-widest text-brand-400 uppercase mb-5">Player Kills</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={playerKillsData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3f54" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#3d5a75', fontSize: 11, fontFamily: 'Rajdhani' }} />
                  <YAxis tick={{ fill: '#3d5a75', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="kills"   fill="#00e566" radius={[4,4,0,0]} name="Kills" />
                  <Bar dataKey="deaths"  fill="#ef4444" radius={[4,4,0,0]} name="Deaths" />
                  <Bar dataKey="assists" fill="#3b82f6" radius={[4,4,0,0]} name="Assists" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Player Win Rate */}
          {playerWinRateData.length > 0 && (
            <div className="card">
              <h2 className="font-display text-sm tracking-widest text-brand-400 uppercase mb-5">Player Win Rate (%)</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={playerWinRateData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3f54" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#3d5a75', fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#3d5a75', fontSize: 11, fontFamily: 'Rajdhani' }} width={70} />
                  <Tooltip content={<CustomTooltip />} formatter={(v) => `${v}%`} />
                  <Bar dataKey="winRate" name="Win Rate" radius={[0,4,4,0]}>
                    {playerWinRateData.map((_, i) => (
                      <Cell key={i} fill={_.winRate >= 50 ? '#00e566' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Role Distribution */}
          {roleData.length > 0 && (
            <div className="card">
              <h2 className="font-display text-sm tracking-widest text-brand-400 uppercase mb-5">Role Distribution</h2>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={roleData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {roleData.map((r, i) => (
                    <div key={r.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="font-body text-white">{r.name}</span>
                      </div>
                      <span className="font-display text-dark-300">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tournament W/L */}
          {tournamentData.length > 0 && (
            <div className="card">
              <h2 className="font-display text-sm tracking-widest text-brand-400 uppercase mb-5">Tournament Results</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={tournamentData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3f54" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#3d5a75', fontSize: 10, fontFamily: 'Rajdhani' }} />
                  <YAxis tick={{ fill: '#3d5a75', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Rajdhani', color: '#3d5a75' }} />
                  <Bar dataKey="wins"   fill="#00e566" radius={[4,4,0,0]} name="Wins" />
                  <Bar dataKey="losses" fill="#ef4444" radius={[4,4,0,0]} name="Losses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
