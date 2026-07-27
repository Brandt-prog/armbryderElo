import { useState } from 'react'

interface LoginViewProps {
  onSignUp: (username: string, password: string) => Promise<void>
  onSignIn: (username: string, password: string) => Promise<void>
  error: string | null
}

export function LoginView({ onSignUp, onSignIn, error }: LoginViewProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (mode === 'signup') {
        await onSignUp(username, password)
      } else {
        await onSignIn(username, password)
      }
    } catch {
      // error is captured via the `error` prop
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{mode === 'signin' ? 'Log ind' : 'Opret konto'}</h2>
      <label>
        Brugernavn
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
        />
      </label>
      <label>
        Kodeord
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Vent...' : mode === 'signin' ? 'Log ind' : 'Opret konto'}
      </button>

      <p>
        {mode === 'signin' ? (
          <>
            Ny her?{' '}
            <button type="button" onClick={() => setMode('signup')}>
              Opret konto
            </button>
          </>
        ) : (
          <>
            Har allerede en konto?{' '}
            <button type="button" onClick={() => setMode('signin')}>
              Log ind
            </button>
          </>
        )}
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}