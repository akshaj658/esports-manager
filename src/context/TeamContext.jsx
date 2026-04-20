import { createContext, useContext, useReducer, useCallback } from 'react'

const TeamContext = createContext(null)

const initialState = {
  players: [],
  tournaments: [],
  loading: false,
  error: null,
}

function teamReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':   return { ...state, loading: action.payload }
    case 'SET_ERROR':     return { ...state, error: action.payload, loading: false }
    case 'SET_PLAYERS':   return { ...state, players: action.payload, loading: false }
    case 'ADD_PLAYER':    return { ...state, players: [action.payload, ...state.players] }
    case 'UPDATE_PLAYER': return { ...state, players: state.players.map(p => p.id === action.payload.id ? action.payload : p) }
    case 'DELETE_PLAYER': return { ...state, players: state.players.filter(p => p.id !== action.payload) }
    case 'SET_TOURNAMENTS':   return { ...state, tournaments: action.payload, loading: false }
    case 'ADD_TOURNAMENT':    return { ...state, tournaments: [action.payload, ...state.tournaments] }
    case 'UPDATE_TOURNAMENT': return { ...state, tournaments: state.tournaments.map(t => t.id === action.payload.id ? action.payload : t) }
    case 'DELETE_TOURNAMENT': return { ...state, tournaments: state.tournaments.filter(t => t.id !== action.payload) }
    default: return state
  }
}

export function TeamProvider({ children }) {
  const [state, dispatch] = useReducer(teamReducer, initialState)

  const setLoading = useCallback((val) => dispatch({ type: 'SET_LOADING', payload: val }), [])
  const setError   = useCallback((err) => dispatch({ type: 'SET_ERROR',   payload: err }), [])

  return (
    <TeamContext.Provider value={{ ...state, dispatch, setLoading, setError }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeam must be used within TeamProvider')
  return ctx
}
