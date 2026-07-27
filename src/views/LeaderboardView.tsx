import { useLeaderboard } from '../viewmodels/useLeaderboard'

export function LeaderboardView() {
  const { members, loading, error } = useLeaderboard()

  if (loading) return <p>Indlæser rangliste...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div>
      <h2>Rangliste</h2>
      {members.length === 0 ? (
        <p>Ingen aktive medlemmer endnu.</p>
      ) : (
        <ol style={{ listStyle: 'none', padding: 0 }}>
          {members.map((member, index) => (
            <li
              key={member.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid #ccc',
              }}
            >
              <span>
                <strong>#{index + 1}</strong> {member.name}
              </span>
              <span>{member.rating}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}