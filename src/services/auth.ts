"use client"

import type { Session, User } from "@supabase/supabase-js"

import { isAdminUser } from "@/src/config/auth"
import { getSupabaseBrowserClient } from "@/src/lib/supabase/client"
import type { AppUser, UserRole } from "@/src/types/auth"

function mapRole(email?: string | null): UserRole {
  return isAdminUser(email) ? "admin" : "user"
}

function mapUserProfile(user: User): Omit<AppUser, "createdAt" | "updatedAt"> {
  const metadata = user.user_metadata

  return {
    id: user.id,
    email: user.email ?? "",
    name: metadata?.full_name ?? metadata?.name ?? null,
    avatarUrl: metadata?.avatar_url ?? metadata?.picture ?? null,
    role: mapRole(user.email),
  }
}

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  return ""
}

export async function signInWithGoogle() {
  const supabase = getSupabaseBrowserClient()
  const redirectTo = `${getBaseUrl()}/auth/callback`


  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  })

  if (error) {
    throw error
  }
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function getCurrentSession() {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return data.session
}

export async function getCurrentUser() {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return data.user
}

export async function exchangeCodeForSession(authCode: string) {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.auth.exchangeCodeForSession(authCode)

  if (error) {
    throw error
  }
}

export async function setSessionFromTokens(accessToken: string, refreshToken: string) {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  if (error) {
    throw error
  }
}

export async function upsertUser(user: User) {
  const supabase = getSupabaseBrowserClient()
  const profile = mapUserProfile(user)
  const timestamp = new Date().toISOString()

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatar_url: profile.avatarUrl,
        role: profile.role,
        updated_at: timestamp,
      },
      {
        onConflict: "id",
      }
    )
    .select("id, email, name, avatar_url, role, created_at, updated_at")
    .single()

  if (error) {
    throw error
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    avatarUrl: data.avatar_url,
    role: data.role,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } satisfies AppUser
}

export function getAuthErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "message" in error) {
    return String(error.message)
  }

  return "Nao foi possivel concluir a autenticacao."
}

export function subscribeToAuthChanges(
  callback: (event: string, session: Session | null) => void
) {
  const supabase = getSupabaseBrowserClient()

  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}
