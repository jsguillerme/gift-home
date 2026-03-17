"use client"

import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"

import {
  getAuthErrorMessage,
  getCurrentSession,
  signInWithGoogle,
  signOut,
  subscribeToAuthChanges,
  upsertUser,
} from "@/src/services/auth"
import type { AppUser } from "@/src/types/auth"

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function syncSession(nextSession: Session | null) {
      setSession(nextSession)

      if (!nextSession?.user) {
        setProfile(null)
        setIsLoading(false)
        return
      }

      try {
        const syncedProfile = await upsertUser(nextSession.user)

        if (!isMounted) {
          return
        }

        setProfile(syncedProfile)
        setError(null)
      } catch (syncError) {
        if (!isMounted) {
          return
        }

        setError(getAuthErrorMessage(syncError))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    async function bootstrap() {
      try {
        const currentSession = await getCurrentSession()

        if (!isMounted) {
          return
        }

        await syncSession(currentSession)
      } catch (sessionError) {
        if (!isMounted) {
          return
        }

        setError(getAuthErrorMessage(sessionError))
        setIsLoading(false)
      }
    }

    void bootstrap()

    const {
      data: { subscription },
    } = subscribeToAuthChanges((_event, nextSession) => {
      if (!isMounted) {
        return
      }

      setIsLoading(true)
      void syncSession(nextSession)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function loginWithGoogle() {
    setIsSigningIn(true)
    setError(null)

    try {
      await signInWithGoogle()
    } catch (loginError) {
      setError(getAuthErrorMessage(loginError))
    } finally {
      setIsSigningIn(false)
    }
  }

  async function logout() {
    setIsSigningOut(true)
    setError(null)

    try {
      await signOut()
      setProfile(null)
      setSession(null)
    } catch (logoutError) {
      setError(getAuthErrorMessage(logoutError))
    } finally {
      setIsSigningOut(false)
    }
  }

  return {
    error,
    isAdmin: profile?.role === "admin",
    isAuthenticated: Boolean(session?.user),
    isLoading,
    isSigningIn,
    isSigningOut,
    loginWithGoogle,
    logout,
    profile,
    session,
  }
}
