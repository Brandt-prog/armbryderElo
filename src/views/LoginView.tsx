import { useState } from 'react'

interface LoginViewProps {
  onSendMagicLink: (email: string) => Promise<void>
  error: string | null
}

export function LoginView({ onSendMagicLink, error }: LoginViewProps) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      await onSendMagicLink(email)
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div>
        <h2>Tjek din email</h2>
        <p>Vi har sendt et login-link til {email}. Klik på det for at logge ind.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log ind</h2>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={sending}>
        {sending ? 'Sender...' : 'Send login-link'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}