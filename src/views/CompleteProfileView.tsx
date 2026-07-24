import { useState } from 'react'

interface CompleteProfileViewProps {
  onComplete: (profile: { name: string; weight: number | null; height: number | null }) => Promise<void>
  error: string | null
}

export function CompleteProfileView({ onComplete, error }: CompleteProfileViewProps) {
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) return
    setSubmitting(true)
    try {
      await onComplete({
        name,
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Fuldfør din profil</h2>
      <label>
        Navn
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Vægt (kg, valgfrit)
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </label>
      <label>
        Højde (cm, valgfrit)
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
      </label>
      <label>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        Jeg accepterer, at mit navn og min rating vises på klubbens rangliste
      </label>
      <button type="submit" disabled={submitting || !consent}>
        {submitting ? 'Opretter...' : 'Opret profil'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}