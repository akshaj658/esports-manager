import { useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTeam } from '../context/TeamContext'
import { tournamentService } from '../services/tournamentService'

export function useTournaments() {
  const { user } = useAuth()
  const { tournaments, loading, error, dispatch, setLoading, setError } = useTeam()

  const fetchTournaments = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await tournamentService.getTournaments(user.id)
      dispatch({ type: 'SET_TOURNAMENTS', payload: data })
    } catch (err) {
      setError(err.message)
    }
  }, [user, dispatch, setLoading, setError])

  useEffect(() => {
    if (tournaments.length === 0) fetchTournaments()
  }, [fetchTournaments, tournaments.length])

  const addTournament = useCallback(async (tournamentData) => {
    const tournament = await tournamentService.createTournament({ ...tournamentData, user_id: user.id })
    dispatch({ type: 'ADD_TOURNAMENT', payload: { ...tournament, matches: [] } })
    return tournament
  }, [user, dispatch])

  const updateTournament = useCallback(async (id, updates) => {
    const tournament = await tournamentService.updateTournament(id, updates)
    dispatch({ type: 'UPDATE_TOURNAMENT', payload: tournament })
    return tournament
  }, [dispatch])

  const deleteTournament = useCallback(async (id) => {
    await tournamentService.deleteTournament(id)
    dispatch({ type: 'DELETE_TOURNAMENT', payload: id })
  }, [dispatch])

  const addMatch = useCallback(async (matchData) => {
    const match = await tournamentService.createMatch(matchData)
    const updated = tournaments.map(t =>
      t.id === matchData.tournament_id
        ? { ...t, matches: [...(t.matches || []), match] }
        : t
    )
    dispatch({ type: 'SET_TOURNAMENTS', payload: updated })
    return match
  }, [dispatch, tournaments])

  const deleteMatch = useCallback(async (matchId, tournamentId) => {
    await tournamentService.deleteMatch(matchId)
    const updated = tournaments.map(t =>
      t.id === tournamentId
        ? { ...t, matches: t.matches.filter(m => m.id !== matchId) }
        : t
    )
    dispatch({ type: 'SET_TOURNAMENTS', payload: updated })
  }, [dispatch, tournaments])

  return { tournaments, loading, error, fetchTournaments, addTournament, updateTournament, deleteTournament, addMatch, deleteMatch }
}
