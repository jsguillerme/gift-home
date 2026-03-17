"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import {
  exchangeCodeForSession,
  getAuthErrorMessage,
  setSessionFromTokens,
} from "@/src/services/auth"

/**
 * Parse OAuth params from URL fragment (#key=value&...).
 * Supabase (e o fluxo implícito OAuth 2.0) redireciona com tokens no hash por
 * segurança — o fragmento não é enviado ao servidor, só processado no cliente.
 * useSearchParams() só lê a query (?), então precisamos ler window.location.hash.
 */
function getParamsFromHash(): { access_token: string | null; refresh_token: string | null } {
  if (typeof window === "undefined") {
    return { access_token: null, refresh_token: null }
  }
  const hash = window.location.hash?.replace(/^#/, "") || ""
  if (!hash) return { access_token: null, refresh_token: null }
  const params = new URLSearchParams(hash)
  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
  }
}

const emptyHashParams = { access_token: null, refresh_token: null }

function subscribeToHashChange(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {}
  }

  window.addEventListener("hashchange", callback)
  return () => window.removeEventListener("hashchange", callback)
}

export function AuthCallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hashParams = useSyncExternalStore(
    subscribeToHashChange,
    getParamsFromHash,
    () => emptyHashParams
  )
  const hashChecked = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const code = searchParams.get("code")
  const accessToken =
    searchParams.get("access_token") ?? hashParams.access_token
  const refreshToken =
    searchParams.get("refresh_token") ?? hashParams.refresh_token
  const [error, setError] = useState<string | null>(null)
  const exchangeStartedRef = useRef(false)

  const hasCode = Boolean(code)
  const hasTokens = Boolean(accessToken && refreshToken)

  useEffect(() => {
    if (!hasCode && !hasTokens) {
      return
    }

    if (exchangeStartedRef.current) {
      return
    }
    exchangeStartedRef.current = true

    async function completeLogin() {
      try {
        if (hasCode && code) {
          await exchangeCodeForSession(code)
        } else if (hasTokens && accessToken && refreshToken) {
          await setSessionFromTokens(accessToken, refreshToken)
        } else {
          return
        }
        router.replace("/")
      } catch (callbackError) {
        setError(getAuthErrorMessage(callbackError))
      }
    }

    void completeLogin()
  }, [hasCode, hasTokens, code, accessToken, refreshToken, router])

  if (hasCode || hasTokens) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-brand-6/30 via-brand-5/10 to-brand-6/5 p-4">
        <div className="rounded-xl bg-white px-6 py-5 text-center shadow-sm">
          <p className="text-sm text-stone-600">
            {error ?? "Concluindo autenticacao com Google..."}
          </p>
        </div>
      </div>
    )
  }

  if (!hashChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-brand-6/30 via-brand-5/10 to-brand-6/5 p-4">
        <div className="rounded-xl bg-white px-6 py-5 text-center text-sm text-stone-600 shadow-sm">
          Carregando...
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-brand-6/30 via-brand-5/10 to-brand-6/5 p-4">
      <div className="rounded-xl bg-white px-6 py-5 text-center shadow-sm">
        <p className="text-sm text-stone-600">
          Codigo ou tokens de autenticacao nao encontrados. Tente fazer login novamente.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-brand-6 underline underline-offset-2 hover:no-underline"
        >
          Voltar ao inicio
        </Link>
      </div>
    </div>
  )
}
