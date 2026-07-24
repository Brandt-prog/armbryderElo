import { useEffect, useState, useCallback } from 'react'
import { AuthService } from '../services/AuthService'
import { UserRepository } from '../repositories/UserRepository'
import type { User } from '../models/User'
import type { Session } from '@supabase/supabase-js'

export type AuthStatus = 'loading' | 'signed_out' | 'needs_profile' | 'signed_in'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  const loadUserForSession = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setCurrentUser(null)
      setStatus('signed_out')
      return
    }
    try {
      const user = await UserRepository.getById(session.user.id)
      if (user) {
        setCurrentUser(user)
        setStatus('signed_in')
      } else {
        setCurrentUser(null)
        setStatus('needs_profile')
      }
    } catch (err) {
      setError((err as Error).message)
      setStatus('signed_out')
    }
  }, [])

  useEffect(() => {
    AuthService.getSession().then((session) => {
      setSession(session)
      loadUserForSession(session)
    })

    const unsubscribe = AuthService.onAuthStateChange((session) => {
      setSession(session)
      loadUserForSession(session)
    })

    return unsubscribe
  }, [loadUserForSession])

  const sendMagicLink = useCallback(async (email: string) => {
    setError(null)
    try {
      await AuthService.sendMagicLink(email)
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }, [])

  const completeProfile = useCallback(
    async (profile: { name: string; weight: number | null; height: number | null }) => {
      if (!session?.user) throw new Error('No active session.')
      setError(null)
      try {
        const newUser = await UserRepository.create({
          id: session.user.id, // link to the Supabase Auth user
          name: profile.name,
          email: session.user.email ?? '',
          roles: ['member'],
          status: 'pending_approval',
          rating: 1200,
          weight: profile.weight,
          height: profile.height,
          consentDate: new Date().toISOString(),
        } as Omit<User, 'createdDate'>)
        setCurrentUser(newUser)
        setStatus('signed_in')
      } catch (err) {
        setError((err as Error).message)
        throw err
      }
    },
    [session]
  )

  const signOut = useCallback(async () => {
    await AuthService.signOut()
    setSession(null)
    setCurrentUser(null)
    setStatus('signed_out')
  }, [])

  return { status, session, currentUser, error, sendMagicLink, completeProfile, signOut }
}