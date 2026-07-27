import { usePlayerStats } from '../viewmodels/usePlayerStats'

interface PlayerStatsViewProps {
  userId: string
}

export function PlayerStatsView({ userId }: PlayerStatsViewProps) {
  const { stats, loading, error } = usePlayerStats(userId)

  if (loading) return <p>Indlæser statistik...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!stats) return null

  return (
    <div>
      <h2>Din statistik</h2>
      <p>
        <strong>{stats.totalWins}</strong> sejre / <strong>{stats.totalLosses}</strong> nederlag
      </p>

      {stats.records.length === 0 ? (
        <p>Ingen kampe spillet endnu.</p>
      ) : (
        <div>
          <h3>Mod hver modstander</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {stats.records.map((record) => (
              <li
                key={record.opponentId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.4rem 0',
                  borderBottom: '1px solid #ccc',
                }}
              >
                <span>{record.opponentName}</span>
                <span>
                  {record.wins}W - {record.losses}L
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}