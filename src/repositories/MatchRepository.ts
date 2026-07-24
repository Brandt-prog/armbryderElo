import { supabase } from '../lib/supabaseClient'
import type { Match } from '../models/Match'
import type { MatchStatus } from '../models/MatchStatus'

const TABLE = 'matches'

// Shape of a row as it exists in the database (snake_case)
interface MatchRow {
  id: string
  player_a_id: string
  player_b_id: string
  winner_id: string
  date: string
  reported_by: string
  confirmed_by: string | null
  status: MatchStatus
  rating_a_before: number | null
  rating_b_before: number | null
  rating_a_after: number | null
  rating_b_after: number | null
}

function toDomain(row: MatchRow): Match {
  return {
    id: row.id,
    playerAId: row.player_a_id,
    playerBId: row.player_b_id,
    winnerId: row.winner_id,
    date: row.date,
    reportedBy: row.reported_by,
    confirmedBy: row.confirmed_by,
    status: row.status,
    ratingABefore: row.rating_a_before,
    ratingBBefore: row.rating_b_before,
    ratingAAfter: row.rating_a_after,
    ratingBAfter: row.rating_b_after,
  }
}

function toRow(match: Partial<Match>): Partial<MatchRow> {
  const row: Partial<MatchRow> = {}
  if (match.id !== undefined) row.id = match.id
  if (match.playerAId !== undefined) row.player_a_id = match.playerAId
  if (match.playerBId !== undefined) row.player_b_id = match.playerBId
  if (match.winnerId !== undefined) row.winner_id = match.winnerId
  if (match.date !== undefined) row.date = match.date
  if (match.reportedBy !== undefined) row.reported_by = match.reportedBy
  if (match.confirmedBy !== undefined) row.confirmed_by = match.confirmedBy
  if (match.status !== undefined) row.status = match.status
  if (match.ratingABefore !== undefined) row.rating_a_before = match.ratingABefore
  if (match.ratingBBefore !== undefined) row.rating_b_before = match.ratingBBefore
  if (match.ratingAAfter !== undefined) row.rating_a_after = match.ratingAAfter
  if (match.ratingBAfter !== undefined) row.rating_b_after = match.ratingBAfter
  return row
}

export const MatchRepository = {
  async getAll(): Promise<Match[]> {
    const { data, error } = await supabase.from(TABLE).select('*')
    if (error) throw error
    return (data as MatchRow[]).map(toDomain)
  },

  async getById(id: string): Promise<Match | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return toDomain(data as MatchRow)
  },

  async getByPlayerId(playerId: string): Promise<Match[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .or(`player_a_id.eq.${playerId},player_b_id.eq.${playerId}`)
    if (error) throw error
    return (data as MatchRow[]).map(toDomain)
  },

  async getPendingForPlayer(playerId: string): Promise<Match[]> {
    // Matches awaiting this player's confirmation
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .or(`player_a_id.eq.${playerId},player_b_id.eq.${playerId}`)
      .eq('status', 'pending_confirmation')
    if (error) throw error
    return (data as MatchRow[]).map(toDomain)
  },

  async create(match: Omit<Match, 'id'>): Promise<Match> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(toRow(match))
      .select()
      .single()
    if (error) throw error
    return toDomain(data as MatchRow)
  },

  async update(id: string, changes: Partial<Match>): Promise<Match> {
    const { data, error } = await supabase
      .from(TABLE)
      .update(toRow(changes))
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return toDomain(data as MatchRow)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
  },
}