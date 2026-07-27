import { MatchRepository } from '../repositories/MatchRepository'
import { UserRepository } from '../repositories/UserRepository'

export interface OpponentRecord {
  opponentId: string
  opponentName: string
  wins: number
  losses: number
}

export interface PlayerStats {
  totalWins: number
  totalLosses: number
  records: OpponentRecord[]
}

/**
 * Calculates win/loss statistics for a player, both overall and broken
 * down per opponent. Only confirmed matches count.
 */
export async function getPlayerStats(userId: string): Promise<PlayerStats> {
  const allMatches = await MatchRepository.getByPlayerId(userId)
  const confirmedMatches = allMatches.filter((m) => m.status === 'confirmed')

  const recordsByOpponent = new Map<string, { wins: number; losses: number }>()
  let totalWins = 0
  let totalLosses = 0

  for (const match of confirmedMatches) {
    const opponentId = match.playerAId === userId ? match.playerBId : match.playerAId
    const won = match.winnerId === userId

    if (won) totalWins++
    else totalLosses++

    const existing = recordsByOpponent.get(opponentId) ?? { wins: 0, losses: 0 }
    if (won) existing.wins++
    else existing.losses++
    recordsByOpponent.set(opponentId, existing)
  }

  // Fetch opponent names
  const opponentIds = Array.from(recordsByOpponent.keys())
  const opponents = await Promise.all(opponentIds.map((id) => UserRepository.getById(id)))

  const records: OpponentRecord[] = opponentIds.map((opponentId, index) => {
    const record = recordsByOpponent.get(opponentId)!
    const opponent = opponents[index]
    return {
      opponentId,
      opponentName: opponent?.name ?? 'Ukendt spiller',
      wins: record.wins,
      losses: record.losses,
    }
  })

  // Sort by most matches played against, descending
  records.sort((a, b) => (b.wins + b.losses) - (a.wins + a.losses))

  return { totalWins, totalLosses, records }
}