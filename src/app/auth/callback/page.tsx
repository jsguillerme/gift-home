import { Suspense } from "react"

import { AuthCallbackClient } from "@/src/components/auth/auth-callback-client"

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-brand-6/30 via-brand-5/10 to-brand-6/5 p-4">
          <div className="rounded-xl bg-white px-6 py-5 text-sm text-stone-600 shadow-sm">
            Carregando...
          </div>
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  )
}
