import { useState, useMemo, useCallback } from 'react'
import { usePlayers } from '../hooks/usePlayers'
import PlayerCard from '../components/ui/PlayerCard'

const ROLES  = ['All', 'IGL', 'Rifler', 'AWPer', 'Support', 'Lurker', 'Entry']
const GAMES  = ['CS2', 'Valorant', 'League of Legends', 'Dota 2', 'Apex Legends', 'Fortnite', 'Other']

const defaultForm = {
  username: '', game: 'CS2', role: 'Rifler',
  kills: 0, deaths: 0, assists: 0, wins: 0, losses: 0, bio: '',
}

export default function RosterPage() {
  const { players, loading, addPlayer, deletePlayer } = usePlayers()
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  const filtered = useMemo(() => {
    return players.filter(p => {
      const matchSearch = p.username?.toLowerCase().includes(search.toLowerCase())
      const matchRole   = roleFilter === 'All' || p.role === roleFilter
      return matchSearch && matchRole
    })
  }, [players, search, roleFilter])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim()) { setError('Username is required'); return }
    setSubmitting(true)
    setError('')
    try {
      await addPlayer({
        ...form,
        kills: Number(form.kills),
        deaths: Number(form.deaths),
        assists: Number(form.assists),
        wins: Number(form.wins),
        losses: Number(form.losses),
      })
      setForm(defaultForm)
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = useCallback(async (id) => {
    try { await deletePlayer(id) } catch (err) { console.error(err) }
  }, [deletePlayer])

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title text-2xl mb-1">Roster</h1>
          <p className="text-dark-300 font-body text-sm">{players.length} players registered</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Player'}
        </button>
      </div>

      {/* Add Player Form */}
      {showForm && (
        <div className="card border-brand-500/30 mb-8 animate-slide-in">
          <h2 className="font-display font-bold text-white tracking-wider mb-5">New Player</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="label">Username *</label>
              <input name="username" value={form.username} onChange={handleChange} className="input" placeholder="GamerTag" required />
            </div>
            <div>
              <label className="label">Game</label>
              <select name="game" value={form.game} onChange={handleChange} className="input">
                {GAMES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input">
                {ROLES.slice(1).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Kills</label>
              <input name="kills" type="number" min="0" value={form.kills} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Deaths</label>
              <input name="deaths" type="number" min="0" value={form.deaths} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Assists</label>
              <input name="assists" type="number" min="0" value={form.assists} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Wins</label>
              <input name="wins" type="number" min="0" value={form.wins} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Losses</label>
              <input name="losses" type="number" min="0" value={form.losses} onChange={handleChange} className="input" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="label">Bio</label>
              <input name="bio" value={form.bio} onChange={handleChange} className="input" placeholder="Short description..." />
            </div>

            {error && (
              <div className="sm:col-span-2 lg:col-span-3 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="sm:col-span-2 lg:col-span-3 flex gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                {submitting ? 'Adding...' : 'Add to Roster'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="input sm:max-w-xs"
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {ROLES.map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg font-display text-xs tracking-widest uppercase transition-all ${
                roleFilter === r
                  ? 'bg-brand-500 text-dark-900'
                  : 'bg-dark-600 text-dark-300 hover:text-white border border-dark-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Player Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-48 animate-pulse bg-dark-700" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="font-display text-dark-300 tracking-widest mb-3">
            {players.length === 0 ? 'NO PLAYERS YET' : 'NO RESULTS'}
          </p>
          <p className="text-dark-300 font-body text-sm">
            {players.length === 0 ? 'Add your first player to get started.' : 'Try a different search or filter.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <PlayerCard key={p.id} player={p} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
