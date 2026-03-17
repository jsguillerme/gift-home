"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { exchangeCodeForSession, getAuthErrorMessage } from "@/src/services/auth"

export function AuthCallbackClient({
  authCode,
}: {
  authCode: string | null
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  console.log('authCode', authCode)

  useEffect(() => {
    if (!authCode) {
      router.replace("/")
      return
    }

    const safeAuthCode = authCode

    async function completeLogin() {
      try {
        await exchangeCodeForSession(safeAuthCode)
        router.replace("/")
      } catch (callbackError) {
        setError(getAuthErrorMessage(callbackError))
      }
    }

    void completeLogin()
  }, [authCode, router])

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
