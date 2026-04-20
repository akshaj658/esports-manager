import { useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTeam } from '../context/TeamContext'
import { playerService } from '../services/playerService'

export function usePlayers() {
  const { user } = useAuth()
  const { players, loading, error, dispatch, setLoading, setError } = useTeam()

  const fetchPlayers = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await playerService.getPlayers(user.id)
      dispatch({ type: 'SET_PLAYERS', payload: data })
    } catch (err) {
      setError(err.message)
    }
  }, [user, dispatch, setLoading, setError])

  useEffect(() => {
    if (players.length === 0) fetchPlayers()
  }, [fetchPlayers, players.length])

  const addPlayer = useCallback(async (playerData) => {
    const player = await playerService.createPlayer({ ...playerData, user_id: user.id })
    dispatch({ type: 'ADD_PLAYER', payload: player })
    return player
  }, [user, dispatch])

  const updatePlayer = useCallback(async (id, updates) => {
    const player = await playerService.updatePlayer(id, updates)
    dispatch({ type: 'UPDATE_PLAYER', payload: player })
    return player
  }, [dispatch])

  const deletePlayer = useCallback(async (id) => {
    await playerService.deletePlayer(id)
    dispatch({ type: 'DELETE_PLAYER', payload: id })
  }, [dispatch])

  return { players, loading, error, fetchPlayers, addPlayer, updatePlayer, deletePlayer }
}
