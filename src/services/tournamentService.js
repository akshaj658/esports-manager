import { supabase } from './supabase'

export const tournamentService = {
  async getTournaments(userId) {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*, matches(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getTournament(id) {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*, matches(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createTournament(tournament) {
    const { data, error } = await supabase
      .from('tournaments')
      .insert([tournament])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateTournament(id, updates) {
    const { data, error } = await supabase
      .from('tournaments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteTournament(id) {
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async createMatch(match) {
    const { data, error } = await supabase
      .from('matches')
      .insert([match])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateMatch(id, updates) {
    const { data, error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteMatch(id) {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
