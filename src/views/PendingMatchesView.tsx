import type { Match } from '../models/Match'
import type { User } from '../models/User'

interface PendingMatchesViewProps {
  pendingMatches: Match[]
  activeMembers: User[]
  currentUserId: string
  onConfirm: (matchId: string) => Promise<void>
  onCancel: (matchId: string) => Promise<void>
  error: string | null
}

export function PendingMatchesView({
  pendingMatches,
  activeMembers,
  currentUserId,
  onConfirm,
  onCancel,
  error,
}: PendingMatchesViewProps) {
  function nameFor(userId: string): string {
    if (userId === currentUserId) return 'dig'
    return activeMembers.find((m) => m.id === userId)?.name ?? 'ukendt'
  }

  if (pendingMatches.length === 0) {
    return <p>Ingen kampe venter på din bekræftelse.</p>
  }

  return (
    <div>
      <h2>Venter på din bekræftelse</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {pendingMatches.map((match) => {
          const winnerName = nameFor(match.winnerId)
          const opponentId = match.playerAId === currentUserId ? match.playerBId : match.playerAId
          return (
            <li
              key={match.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid #ccc',
              }}
            >
              <span>
                {nameFor(opponentId)} rapporterede: <strong>{winnerName}</strong> vandt
              </span>
              <span>
                <button onClick={() => onConfirm(match.id)} style={{ marginRight: '0.5rem' }}>
                  Bekræft
                </button>
                <button onClick={() => onCancel(match.id)}>Afvis</button>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}