import { useState, useCallback } from 'react'
import { useTournaments } from '../hooks/useTournaments'

const defaultTournamentForm = { name: '', game: 'CS2', format: 'Online', status: 'Ongoing' }
const defaultMatchForm = { opponent: '', result: 'win', score: '', notes: '' }

export default function TournamentsPage() {
  const { tournaments, loading, addTournament, deleteTournament, addMatch, deleteMatch } = useTournaments()
  const [showTournamentForm, setShowTournamentForm] = useState(false)
  const [tForm, setTForm]           = useState(defaultTournamentForm)
  const [tSubmitting, setTSubmitting] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [matchForms, setMatchForms] = useState({})
  const [showMatchForm, setShowMatchForm] = useState(null)
  const [error, setError]           = useState('')

  const handleTFormChange = useCallback((e) => {
    setTForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const handleTSubmit = async (e) => {
    e.preventDefault()
    if (!tForm.name.trim()) return
    setTSubmitting(true)
    setError('')
    try {
      await addTournament(tForm)
      setTForm(defaultTournamentForm)
      setShowTournamentForm(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setTSubmitting(false)
    }
  }

  const handleMatchFormChange = useCallback((tournamentId, e) => {
    setMatchForms(prev => ({
      ...prev,
      [tournamentId]: { ...(prev[tournamentId] || defaultMatchForm), [e.target.name]: e.target.value }
    }))
  }, [])

  const handleMatchSubmit = async (e, tournamentId) => {
    e.preventDefault()
    const form = matchForms[tournamentId] || defaultMatchForm
    if (!form.opponent?.trim()) return
    try {
      await addMatch({ ...form, tournament_id: tournamentId })
      setMatchForms(prev => ({ ...prev, [tournamentId]: defaultMatchForm }))
      setShowMatchForm(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const wins   = (t) => (t.matches || []).filter(m => m.result === 'win').length
  const losses = (t) => (t.matches || []).filter(m => m.result === 'loss').length

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title text-2xl mb-1">Tournaments</h1>
          <p className="text-dark-300 font-body text-sm">{tournaments.length} tournaments registered</p>
        </div>
        <button onClick={() => setShowTournamentForm(!showTournamentForm)} className="btn-primary">
          {showTournamentForm ? 'Cancel' : '+ New Tournament'}
        </button>
      </div>

      {/* New Tournament Form */}
      {showTournamentForm && (
        <div className="card border-brand-500/30 mb-8 animate-slide-in">
          <h2 className="font-display font-bold text-white tracking-wider mb-5">Create Tournament</h2>
          <form onSubmit={handleTSubmit} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Tournament Name *</label>
              <input name="name" value={tForm.name} onChange={handleTFormChange} className="input" placeholder="ESL Pro League Season 20" required />
            </div>
            <div>
              <label className="label">Game</label>
              <select name="game" value={tForm.game} onChange={handleTFormChange} className="input">
                {['CS2','Valorant','League of Legends','Dota 2','Apex Legends','Other'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Format</label>
              <select name="format" value={tForm.format} onChange={handleTFormChange} className="input">
                {['Online','LAN','Hybrid'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select name="status" value={tForm.status} onChange={handleTFormChange} className="input">
                {['Ongoing','Completed','Upcoming'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {error && <div className="sm:col-span-2 lg:col-span-4 text-red-400 text-sm">{error}</div>}
            <div className="sm:col-span-2 lg:col-span-4 flex gap-3">
              <button type="submit" disabled={tSubmitting} className="btn-primary disabled:opacity-50">
                {tSubmitting ? 'Creating...' : 'Create Tournament'}
              </button>
              <button type="button" onClick={() => setShowTournamentForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Tournament List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-dark-700" />)}
        </div>
      ) : tournaments.length === 0 ? (
        <div className="card text-center py-20">
          <p className="font-display text-dark-300 tracking-widest mb-2">NO TOURNAMENTS YET</p>
          <p className="text-dark-300 font-body text-sm">Create your first tournament to start logging matches.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tournaments.map(t => {
            const w = wins(t)
            const l = losses(t)
            const isExpanded = expandedId === t.id
            const matchForm = matchForms[t.id] || defaultMatchForm

            return (
              <div key={t.id} className="card border-dark-400">
                {/* Tournament Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="font-display font-bold text-white tracking-wider truncate">{t.name}</h2>
                      <span className={`badge border text-xs ${
                        t.status === 'Ongoing'   ? 'bg-brand-500/20 text-brand-400 border-brand-500/40' :
                        t.status === 'Completed' ? 'bg-dark-500/50 text-dark-300 border-dark-400' :
                                                   'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      }`}>{t.status}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-dark-300 font-body">
                      <span>{t.game}</span>
                      <span>·</span>
                      <span>{t.format}</span>
                      <span>·</span>
                      <span className="text-brand-400">{w}W</span>
                      <span className="text-red-400">{l}L</span>
                      <span>·</span>
                      <span>{(t.matches || []).length} matches</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : t.id)}
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      {isExpanded ? 'Hide' : 'View'}
                    </button>
                    <button
                      onClick={() => { if (window.confirm('Delete this tournament?')) deleteTournament(t.id) }}
                      className="text-dark-300 hover:text-red-400 transition-colors text-lg leading-none px-1"
                    >×</button>
                  </div>
                </div>

                {/* Expanded: Matches */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-dark-400 animate-slide-in">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display text-sm tracking-widest text-brand-400 uppercase">Match Log</h3>
                      <button
                        onClick={() => setShowMatchForm(showMatchForm === t.id ? null : t.id)}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        {showMatchForm === t.id ? 'Cancel' : '+ Log Match'}
                      </button>
                    </div>

                    {/* Match Form */}
                    {showMatchForm === t.id && (
                      <form onSubmit={(e) => handleMatchSubmit(e, t.id)} className="bg-dark-700 rounded-xl p-4 mb-4 grid sm:grid-cols-2 gap-3 animate-slide-in">
                        <div>
                          <label className="label">Opponent *</label>
                          <input name="opponent" value={matchForm.opponent} onChange={(e) => handleMatchFormChange(t.id, e)} className="input" placeholder="Team Name" required />
                        </div>
                        <div>
                          <label className="label">Result</label>
                          <select name="result" value={matchForm.result} onChange={(e) => handleMatchFormChange(t.id, e)} className="input">
                            <option value="win">Win</option>
                            <option value="loss">Loss</option>
                            <option value="draw">Draw</option>
                          </select>
                        </div>
                        <div>
                          <label className="label">Score</label>
                          <input name="score" value={matchForm.score} onChange={(e) => handleMatchFormChange(t.id, e)} className="input" placeholder="16-12" />
                        </div>
                        <div>
                          <label className="label">Notes</label>
                          <input name="notes" value={matchForm.notes} onChange={(e) => handleMatchFormChange(t.id, e)} className="input" placeholder="Optional notes..." />
                        </div>
                        <div className="sm:col-span-2 flex gap-3">
                          <button type="submit" className="btn-primary text-xs px-4 py-2">Log Match</button>
                          <button type="button" onClick={() => setShowMatchForm(null)} className="btn-secondary text-xs px-4 py-2">Cancel</button>
                        </div>
                      </form>
                    )}

                    {/* Match List */}
                    {(t.matches || []).length === 0 ? (
                      <p className="text-dark-300 text-sm font-body text-center py-4">No matches logged yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {[...t.matches].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(m => (
                          <div key={m.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg border border-dark-500">
                            <div className="flex items-center gap-3">
                              <span className={`badge border text-xs ${
                                m.result === 'win'  ? 'bg-brand-500/20 text-brand-400 border-brand-500/40' :
                                m.result === 'loss' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                                                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                              }`}>{m.result?.toUpperCase()}</span>
                              <div>
                                <p className="font-body font-semibold text-white text-sm">vs {m.opponent}</p>
                                {m.notes && <p className="text-xs text-dark-300">{m.notes}</p>}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {m.score && <span className="font-display text-sm text-dark-300">{m.score}</span>}
                              <button onClick={() => deleteMatch(m.id, t.id)} className="text-dark-300 hover:text-red-400 transition-colors text-lg leading-none">×</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
