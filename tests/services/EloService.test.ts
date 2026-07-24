import { describe, it, expect } from 'vitest'
import { calculateNewRatings, getExpectedScore, getKFactor, STARTING_RATING } from '../../src/services/EloService'

describe('getKFactor', () => {
  it('returns the "new player" K-factor for fewer than 10 matches', () => {
    expect(getKFactor(0)).toBe(40)
    expect(getKFactor(9)).toBe(40)
  })

  it('returns the "intermediate" K-factor for 10–29 matches', () => {
    expect(getKFactor(10)).toBe(30)
    expect(getKFactor(29)).toBe(30)
  })

  it('returns the "experienced" K-factor for 30+ matches', () => {
    expect(getKFactor(30)).toBe(20)
    expect(getKFactor(100)).toBe(20)
  })
})

describe('getExpectedScore', () => {
  it('returns 0.5 when both ratings are equal', () => {
    expect(getExpectedScore(1200, 1200)).toBeCloseTo(0.5)
  })

  it('returns a higher expected score for the stronger player', () => {
    const expectedForStronger = getExpectedScore(1400, 1200)
    const expectedForWeaker = getExpectedScore(1200, 1400)
    expect(expectedForStronger).toBeGreaterThan(0.5)
    expect(expectedForWeaker).toBeLessThan(0.5)
    expect(expectedForStronger + expectedForWeaker).toBeCloseTo(1)
  })
})

describe('calculateNewRatings', () => {
  it('increases the winner\'s rating and decreases the loser\'s, for equal ratings', () => {
    const result = calculateNewRatings(STARTING_RATING, STARTING_RATING, 0, 0, 'A')
    expect(result.newRatingA).toBeGreaterThan(STARTING_RATING)
    expect(result.newRatingB).toBeLessThan(STARTING_RATING)
  })

  it('gives a bigger rating jump when an underdog wins', () => {
    const upsetResult = calculateNewRatings(1000, 1400, 15, 15, 'A')
    const expectedResult = calculateNewRatings(1200, 1200, 15, 15, 'A')

    const upsetGain = upsetResult.newRatingA - 1000
    const expectedGain = expectedResult.newRatingA - 1200

    expect(upsetGain).toBeGreaterThan(expectedGain)
  })

  it('moves a new player\'s rating more than an experienced player\'s, all else equal', () => {
    const newPlayerResult = calculateNewRatings(1200, 1200, 0, 0, 'A')
    const experiencedPlayerResult = calculateNewRatings(1200, 1200, 40, 40, 'A')

    const newPlayerGain = newPlayerResult.newRatingA - 1200
    const experiencedPlayerGain = experiencedPlayerResult.newRatingA - 1200

    expect(newPlayerGain).toBeGreaterThan(experiencedPlayerGain)
  })

  it('is symmetric: swapping A and B and the winner gives mirrored results', () => {
    const result1 = calculateNewRatings(1300, 1250, 5, 12, 'A')
    const result2 = calculateNewRatings(1250, 1300, 12, 5, 'B')

    expect(result1.newRatingA).toBe(result2.newRatingB)
    expect(result1.newRatingB).toBe(result2.newRatingA)
  })
})