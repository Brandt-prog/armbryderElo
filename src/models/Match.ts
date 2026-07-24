import type { MatchStatus } from './MatchStatus'

export interface Match {
  id: string
  playerAId: string
  playerBId: string
  winnerId: string
  date: string

  reportedBy: string           // player who reported the result
  confirmedBy: string | null   // set when confirmed — either the other player, or a judge

  status: MatchStatus

  ratingABefore: number | null
  ratingBBefore: number | null
  ratingAAfter: number | null
  ratingBAfter: number | null
}