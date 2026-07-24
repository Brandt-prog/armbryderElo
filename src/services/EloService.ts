/**
 * EloService — calculates rating changes after a match.
 *
 * Uses a dynamic K-factor: newer players' ratings move faster,
 * so they reach their "true" skill level sooner, while experienced
 * players' ratings stay more stable.
 */

export const STARTING_RATING = 1200

const K_FACTOR_NEW = 40
const K_FACTOR_INTERMEDIATE = 30
const K_FACTOR_EXPERIENCED = 20

const NEW_PLAYER_THRESHOLD = 10        // fewer than this many matches played
const EXPERIENCED_PLAYER_THRESHOLD = 30 // this many matches or more

export function getKFactor(matchesPlayed: number): number {
  if (matchesPlayed < NEW_PLAYER_THRESHOLD) return K_FACTOR_NEW
  if (matchesPlayed < EXPERIENCED_PLAYER_THRESHOLD) return K_FACTOR_INTERMEDIATE
  return K_FACTOR_EXPERIENCED
}

export function getExpectedScore(ratingSelf: number, ratingOpponent: number): number {
  return 1 / (1 + Math.pow(10, (ratingOpponent - ratingSelf) / 400))
}

export interface NewRatings {
  newRatingA: number
  newRatingB: number
}

/**
 * Calculates the new ratings for both players after a match.
 *
 * @param ratingA current rating of player A
 * @param ratingB current rating of player B
 * @param matchesPlayedA number of matches player A has played before this one
 * @param matchesPlayedB number of matches player B has played before this one
 * @param winner which player won: 'A' or 'B'
 */
export function calculateNewRatings(
  ratingA: number,
  ratingB: number,
  matchesPlayedA: number,
  matchesPlayedB: number,
  winner: 'A' | 'B'
): NewRatings {
  const expectedA = getExpectedScore(ratingA, ratingB)
  const expectedB = getExpectedScore(ratingB, ratingA)

  const scoreA = winner === 'A' ? 1 : 0
  const scoreB = winner === 'B' ? 1 : 0

  const kA = getKFactor(matchesPlayedA)
  const kB = getKFactor(matchesPlayedB)

  const newRatingA = Math.round(ratingA + kA * (scoreA - expectedA))
  const newRatingB = Math.round(ratingB + kB * (scoreB - expectedB))

  return { newRatingA, newRatingB }
}