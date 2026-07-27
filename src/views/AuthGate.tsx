import type { ReactNode } from 'react'
import { useAuth } from '../viewmodels/useAuth'
import { LoginView } from './LoginView'
import { CompleteProfileView } from './CompleteProfileView'
import type { User } from '../models/User'

interface AuthGateProps {
  children: (currentUser: User, signOut: () => Promise<void>) => ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const { status, currentUser, error, signUp, signIn, completeProfile, signOut } = useAuth()

  if (status === 'loading') {
    return <p>Indlæser...</p>
  }

  if (status === 'signed_out') {
    return <LoginView onSignUp={signUp} onSignIn={signIn} error={error} />
  }

  if (status === 'needs_profile') {
    return <CompleteProfileView onComplete={completeProfile} error={error} />
  }

  if (!currentUser) {
    return <p>Noget gik galt — prøv at genindlæse siden.</p>
  }

  return <>{children(currentUser, signOut)}</>
}