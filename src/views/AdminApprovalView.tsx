import { usePendingMembers } from '../viewmodels/usePendingMembers'

export function AdminApprovalView() {
  const { pendingMembers, loading, error, approve, reject } = usePendingMembers()

  if (loading) return <p>Indlæser ventende medlemmer...</p>

  return (
    <div>
      <h2>Ventende medlemmer</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {pendingMembers.length === 0 ? (
        <p>Ingen medlemmer venter på godkendelse.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pendingMembers.map((member) => (
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
                {member.name} ({member.username})
              </span>
              <span>
                <button onClick={() => approve(member.id)} style={{ marginRight: '0.5rem' }}>
                  Godkend
                </button>
                <button onClick={() => reject(member.id)}>Afvis</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}