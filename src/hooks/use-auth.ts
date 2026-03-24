"use client"

import { useEffect, useRef, useState } from "react"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"

import {
  getAuthErrorMessage,
  getCurrentSession,
  mapSessionUserToProfile,
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
  const syncedUserIdRef = useRef<string | null>(null)
  const profileRef = useRef<AppUser | null>(null)

  useEffect(() => {
    profileRef.current = profile
  }, [profile])

  useEffect(() => {
    let isMounted = true

    async function syncSession(nextSession: Session | null, options?: { syncProfile?: boolean }) {
      setSession(nextSession)

      if (!nextSession?.user) {
        setProfile(null)
        syncedUserIdRef.current = null
        setIsLoading(false)
        return
      }

      if (!options?.syncProfile) {
        setProfile((currentProfile) => currentProfile ?? mapSessionUserToProfile(nextSession.user))
        setError(null)
        setIsLoading(false)
        return
      }

      try {
        const syncedProfile = await upsertUser(nextSession.user)

        if (!isMounted) {
          return
        }

        setProfile(syncedProfile)
        syncedUserIdRef.current = nextSession.user.id
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

    async function handleAuthChange(event: AuthChangeEvent, nextSession: Session | null) {
      if (!isMounted) {
        return
      }

      if (event === "SIGNED_OUT" || !nextSession?.user) {
        await syncSession(null)
        return
      }

      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        const shouldSyncProfile =
          syncedUserIdRef.current !== nextSession.user.id || profileRef.current === null

        await syncSession(nextSession, { syncProfile: shouldSyncProfile })
        return
      }

      await syncSession(nextSession)
    }

    async function bootstrap() {
      try {
        const currentSession = await getCurrentSession()

        if (!isMounted) {
          return
        }

        await syncSession(currentSession, { syncProfile: Boolean(currentSession?.user) })
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
    } = subscribeToAuthChanges((event, nextSession) => {
      void handleAuthChange(event, nextSession)
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
      syncedUserIdRef.current = null
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
