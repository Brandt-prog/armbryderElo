import type { ReactNode } from 'react'
import { useAuth } from '../viewmodels/useAuth'
import { LoginView } from './LoginView'
import { CompleteProfileView } from './CompleteProfileView'

interface AuthGateProps {
  children: (currentUser: NonNullable<ReturnType<typeof useAuth>['currentUser']>) => ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const { status, currentUser, error, sendMagicLink, completeProfile } = useAuth()

  if (status === 'loading') {
    return <p>Indlæser...</p>
  }

  if (status === 'signed_out') {
    return <LoginView onSendMagicLink={sendMagicLink} error={error} />
  }

  if (status === 'needs_profile') {
    return <CompleteProfileView onComplete={completeProfile} error={error} />
  }

  if (!currentUser) {
    return <p>Noget gik galt — prøv at genindlæse siden.</p>
  }

  return <>{children(currentUser)}</>
}