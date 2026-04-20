import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { usePlayers } from '../hooks/usePlayers'
import { playerService } from '../services/playerService'

const GAMES = ['CS2', 'Valorant', 'League of Legends', 'Dota 2', 'Apex Legends', 'Fortnite', 'Other']
const ROLES = ['IGL', 'Rifler', 'AWPer', 'Support', 'Lurker', 'Entry']

export default function PlayerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updatePlayer, deletePlayer } = usePlayers()
  const [player, setPlayer]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({})
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    playerService.getPlayer(id).then(data => {
      setPlayer(data)
      setForm(data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [id])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const updated = await updatePlayer(id, {
        username: form.username,
        game: form.game,
        role: form.role,
        kills: Number(form.kills),
        deaths: Number(form.deaths),
        assists: Number(form.assists),
        wins: Number(form.wins),
        losses: Number(form.losses),
        bio: form.bio,
      })
      setPlayer(updated)
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Permanently remove ${player.username}?`)) return
    await deletePlayer(id)
    navigate('/roster')
  }

  if (loading) return (
    <div className="page-container">
      <div className="card h-64 animate-pulse bg-dark-700 max-w-2xl" />
    </div>
  )

  if (!player) return (
    <div className="page-container text-center py-20">
      <p className="font-display text-dark-300 tracking-widest mb-4">PLAYER NOT FOUND</p>
      <Link to="/roster" className="btn-secondary">Back to Roster</Link>
    </div>
  )

  const kd = player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : '∞'
  const winRate = player.wins + player.losses > 0
    ? Math.round((player.wins / (player.wins + player.losses)) * 100)
    : 0

  return (
    <div className="page-container max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-display tracking-widest text-dark-300 mb-6 uppercase">
        <Link to="/roster" className="hover:text-brand-400 transition-colors">Roster</Link>
        <span>/</span>
        <span className="text-white">{player.username}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card text-center lg:col-span-1">
          <div className="w-20 h-20 rounded-xl bg-dark-600 border-2 border-brand-500/40 flex items-center justify-center font-display font-bold text-3xl text-brand-400 mx-auto mb-4">
            {player.username?.[0]?.toUpperCase()}
          </div>
          <h1 className="font-display font-bold text-2xl tracking-wider text-white mb-1">{player.username}</h1>
          <p className="text-dark-300 text-sm font-body mb-3">{player.game}</p>
          <span className="badge bg-brand-500/20 text-brand-400 border border-brand-500/40 mb-4">
            {player.role}
          </span>
          {player.bio && <p className="text-dark-300 text-sm font-body mt-3 border-t border-dark-400 pt-3">{player.bio}</p>}

          <div className="flex gap-2 mt-5">
            <button onClick={() => setEditing(!editing)} className="btn-secondary flex-1 text-xs">
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button onClick={handleDelete} className="btn-danger flex-1 text-xs">Delete</button>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Kills',   value: player.kills   ?? 0 },
              { label: 'Deaths',  value: player.deaths  ?? 0 },
              { label: 'Assists', value: player.assists ?? 0 },
              { label: 'K/D',     value: kd, accent: true },
            ].map(s => (
              <div key={s.label} className="card text-center py-4">
                <p className={`font-display font-bold text-2xl ${s.accent ? 'text-brand-400 glow-text' : 'text-white'}`}>{s.value}</p>
                <p className="text-xs text-dark-300 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Wins',     value: player.wins   ?? 0, color: 'text-brand-400' },
              { label: 'Losses',   value: player.losses ?? 0, color: 'text-red-400'   },
              { label: 'Win Rate', value: `${winRate}%`,      color: winRate >= 50 ? 'text-brand-400' : 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="card text-center py-4">
                <p className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</p>
                <p className="text-xs text-dark-300 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Edit Form */}
          {editing && (
            <form onSubmit={handleSave} className="card border-brand-500/30 animate-slide-in">
              <h3 className="font-display text-white tracking-wider mb-4">Edit Player</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Username</label>
                  <input name="username" value={form.username || ''} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="label">Game</label>
                  <select name="game" value={form.game || ''} onChange={handleChange} className="input">
                    {GAMES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Role</label>
                  <select name="role" value={form.role || ''} onChange={handleChange} className="input">
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Kills</label>
                  <input name="kills" type="number" min="0" value={form.kills || 0} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="label">Deaths</label>
                  <input name="deaths" type="number" min="0" value={form.deaths || 0} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="label">Assists</label>
                  <input name="assists" type="number" min="0" value={form.assists || 0} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="label">Wins</label>
                  <input name="wins" type="number" min="0" value={form.wins || 0} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="label">Losses</label>
                  <input name="losses" type="number" min="0" value={form.losses || 0} onChange={handleChange} className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Bio</label>
                  <input name="bio" value={form.bio || ''} onChange={handleChange} className="input" />
                </div>
              </div>
              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
              <div className="flex gap-3 mt-4">
                <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
