"use client"

import { Gift } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"

interface LoginScreenProps {
  error?: string | null
  isLoading?: boolean
  onLogin: () => void
}

export function LoginScreen({
  error,
  isLoading = false,
  onLogin,
}: LoginScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-brand-6/30 via-brand-5/10 to-brand-6/5 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center justify-center rounded-3xl bg-linear-to-br from-brand-1 to-brand-2 p-4 shadow-lg sm:mb-6 sm:p-5">
            <Gift className="h-12 w-12 text-white sm:h-16 sm:w-16" />
          </div>
          <h1 className="mb-2 bg-linear-to-r from-brand-1 to-brand-3 bg-clip-text text-3xl font-bold text-transparent sm:mb-3 sm:text-4xl">
            Lista de presentes da Gabriella e Guilherme
          </h1>
          <p className="px-4 text-sm text-stone-600 sm:text-base">
            Faça login com Google para ver a lista e reservar um presente.
          </p>
        </div>

        <Card className="border-brand-5/40 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="mb-2 text-xl font-semibold text-brand-1 sm:text-2xl">
                  Bem-vindo
                </h2>
                <p className="text-sm text-stone-600 sm:text-base">
                  Desde ja, obrigado por participar desse momento com a gente.
                </p>
              </div>

              <Button
                onClick={onLogin}
                disabled={isLoading}
                className="h-12 w-full border-2 border-stone-300 bg-white text-sm font-medium text-stone-700 shadow-sm transition-all hover:bg-stone-50 hover:shadow-md sm:h-14 sm:text-base"
              >
                <svg className="mr-3 h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isLoading ? "Conectando..." : "Entrar com Google"}
              </Button>

              {error ? (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
