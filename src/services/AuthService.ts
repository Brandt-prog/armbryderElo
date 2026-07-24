import { supabase } from '../lib/supabaseClient'
import type { Session, User as SupabaseAuthUser } from '@supabase/supabase-js'

export const AuthService = {
  /**
   * Sends a magic link to the given email. The user clicks the link
   * in their inbox to complete sign-in — no password involved.
   */
  async sendMagicLink(email: string): Promise<void> {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) throw error
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  getCurrentAuthUser(session: Session | null): SupabaseAuthUser | null {
    return session?.user ?? null
  },

  /**
   * Subscribes to auth state changes (login, logout, token refresh).
   * Returns an unsubscribe function.
   */
  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session)
    })
    return () => data.subscription.unsubscribe()
  },
}