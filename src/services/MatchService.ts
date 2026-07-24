import { UserRepository } from '../repositories/UserRepository'
import { MatchRepository } from '../repositories/MatchRepository'
import { calculateNewRatings, STARTING_RATING } from './EloService'
import type { Match } from '../models/Match'
import type { User } from '../models/User'

/**
 * MatchService — orchestrates the report/confirm handshake flow for matches,
 * and applies rating changes once a match is confirmed.
 */

export class MatchServiceError extends Error {}

/**
 * Step 1: One player reports the result of a match.
 * The match starts in 'pending_confirmation' — no ratings are touched yet.
 */
export async function reportMatch(
  playerAId: string,
  playerBId: string,
  winnerId: string,
  reportedById: string
): Promise<Match> {
  if (playerAId === playerBId) {
    throw new MatchServiceError('A player cannot play against themselves.')
  }
  if (winnerId !== playerAId && winnerId !== playerBId) {
    throw new MatchServiceError('The winner must be one of the two players.')
  }
  if (reportedById !== playerAId && reportedById !== playerBId) {
    throw new MatchServiceError('Only one of the two players can report the match.')
  }

  return MatchRepository.create({
    playerAId,
    playerBId,
    winnerId,
    date: new Date().toISOString(),
    reportedBy: reportedById,
    confirmedBy: null,
    status: 'pending_confirmation',
    ratingABefore: null,
    ratingBBefore: null,
    ratingAAfter: null,
    ratingBAfter: null,
  })
}

/**
 * Step 2: The match is confirmed — either by the other player (handshake),
 * or by a user with the 'judge' role. This is the only point where
 * ratings are actually calculated and applied.
 */
export async function confirmMatch(matchId: string, confirmingUserId: string): Promise<Match> {
  const match = await MatchRepository.getById(matchId)
  if (!match) {
    throw new MatchServiceError('Match not found.')
  }
  if (match.status !== 'pending_confirmation') {
    throw new MatchServiceError(`Match cannot be confirmed from status "${match.status}".`)
  }

  const confirmingUser = await UserRepository.getById(confirmingUserId)
  if (!confirmingUser) {
    throw new MatchServiceError('Confirming user not found.')
  }

  const isOtherPlayer =
    (confirmingUserId === match.playerAId || confirmingUserId === match.playerBId) &&
    confirmingUserId !== match.reportedBy
  const isJudge = confirmingUser.roles.includes('judge')

  if (!isOtherPlayer && !isJudge) {
    throw new MatchServiceError(
      'Only the other player, or a judge, can confirm this match.'
    )
  }

  const playerA = await UserRepository.getById(match.playerAId)
  const playerB = await UserRepository.getById(match.playerBId)
  if (!playerA || !playerB) {
    throw new MatchServiceError('One or both players could not be found.')
  }

  const ratingA = playerA.rating ?? STARTING_RATING
  const ratingB = playerB.rating ?? STARTING_RATING

  const matchesPlayedA = (await MatchRepository.getByPlayerId(playerA.id)).filter(
    (m) => m.status === 'confirmed'
  ).length
  const matchesPlayedB = (await MatchRepository.getByPlayerId(playerB.id)).filter(
    (m) => m.status === 'confirmed'
  ).length

  const winnerSide: 'A' | 'B' = match.winnerId === match.playerAId ? 'A' : 'B'

  const { newRatingA, newRatingB } = calculateNewRatings(
    ratingA,
    ratingB,
    matchesPlayedA,
    matchesPlayedB,
    winnerSide
  )

  const updatedMatch = await MatchRepository.update(matchId, {
    status: 'confirmed',
    confirmedBy: confirmingUserId,
    ratingABefore: ratingA,
    ratingBBefore: ratingB,
    ratingAAfter: newRatingA,
    ratingBAfter: newRatingB,
  })

  await UserRepository.update(playerA.id, { rating: newRatingA })
  await UserRepository.update(playerB.id, { rating: newRatingB })

  return updatedMatch
}

/**
 * Alternative to confirmation: the two players agree the match wasn't valid,
 * or the reported result was wrong. No ratings are affected.
 */
export async function cancelMatch(matchId: string): Promise<Match> {
  const match = await MatchRepository.getById(matchId)
  if (!match) {
    throw new MatchServiceError('Match not found.')
  }
  if (match.status !== 'pending_confirmation') {
    throw new MatchServiceError(`Match cannot be cancelled from status "${match.status}".`)
  }

  return MatchRepository.update(matchId, { status: 'cancelled' })
}