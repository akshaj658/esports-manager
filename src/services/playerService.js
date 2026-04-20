import { supabase } from './supabase'

export const playerService = {
  async getPlayers(userId) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getPlayer(id) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createPlayer(player) {
    const { data, error } = await supabase
      .from('players')
      .insert([player])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updatePlayer(id, updates) {
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deletePlayer(id) {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
