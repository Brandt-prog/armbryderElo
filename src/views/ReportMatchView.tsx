import { useState } from 'react'
import type { User } from '../models/User'

interface ReportMatchViewProps {
  currentUserId: string
  activeMembers: User[]
  onReport: (opponentId: string, winnerId: string) => Promise<void>
  error: string | null
}

export function ReportMatchView({ currentUserId, activeMembers, onReport, error }: ReportMatchViewProps) {
  const [opponentId, setOpponentId] = useState('')
  const [winner, setWinner] = useState<'me' | 'opponent'>('me')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!opponentId) return
    setSubmitting(true)
    setSuccess(false)
    try {
      const winnerId = winner === 'me' ? currentUserId : opponentId
      await onReport(opponentId, winnerId)
      setSuccess(true)
      setOpponentId('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Rapportér en kamp</h2>
      <label>
        Modstander
        <select value={opponentId} onChange={(e) => setOpponentId(e.target.value)} required>
          <option value="">Vælg modstander...</option>
          {activeMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.rating})
            </option>
          ))}
        </select>
      </label>

      <div>
        <label>
          <input
            type="radio"
            name="winner"
            checked={winner === 'me'}
            onChange={() => setWinner('me')}
          />
          Jeg vandt
        </label>
        <label>
          <input
            type="radio"
            name="winner"
            checked={winner === 'opponent'}
            onChange={() => setWinner('opponent')}
          />
          Modstanderen vandt
        </label>
      </div>

      <button type="submit" disabled={submitting || !opponentId}>
        {submitting ? 'Rapporterer...' : 'Rapportér resultat'}
      </button>

      {success && <p style={{ color: 'green' }}>Rapporteret! Venter på modstanderens bekræftelse.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}