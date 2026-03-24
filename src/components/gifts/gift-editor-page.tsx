"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { LoginScreen } from "@/src/components/auth/login-screen"
import { GiftForm } from "@/src/components/gifts/gift-form"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { useAuth } from "@/src/hooks/use-auth"
import { createGift, getGiftById, getGiftErrorMessage, updateGift } from "@/src/services/gifts"
import type { Gift as GiftType, GiftMutationInput } from "@/src/types/gift"

interface GiftEditorPageProps {
  giftId?: string
}

export function GiftEditorPage({ giftId }: GiftEditorPageProps) {
  const auth = useAuth()
  const router = useRouter()
  const [gift, setGift] = useState<GiftType | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isGiftLoading, setIsGiftLoading] = useState(Boolean(giftId))
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!giftId || !auth.isAuthenticated || !auth.isAdmin) {
      setIsGiftLoading(false)
      return
    }

    const currentGiftId = giftId
    let isMounted = true

    async function loadGift() {
      setIsGiftLoading(true)
      setFeedback(null)

      try {
        const currentGift = await getGiftById(currentGiftId)

        if (!isMounted) {
          return
        }

        setGift(currentGift)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setFeedback(getGiftErrorMessage(error))
      } finally {
        if (isMounted) {
          setIsGiftLoading(false)
        }
      }
    }

    void loadGift()

    return () => {
      isMounted = false
    }
  }, [auth.isAdmin, auth.isAuthenticated, giftId])

  async function handleSubmit(values: GiftMutationInput) {
    setIsSubmitting(true)
    setFeedback(null)

    try {
      if (giftId) {
        await updateGift(giftId, values)
      } else {
        await createGift(values)
      }

      router.push("/")
    } catch (error) {
      setFeedback(getGiftErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-sm text-stone-600">
        Carregando...
      </div>
    )
  }

  if (!auth.isAuthenticated || !auth.profile) {
    return (
      <LoginScreen
        error={auth.error}
        isLoading={auth.isSigningIn}
        onLogin={auth.loginWithGoogle}
      />
    )
  }

  if (!auth.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <p className="text-sm text-stone-600">
            Apenas administradores podem gerenciar presentes.
          </p>
          <Button asChild className="mt-4 bg-brand-1 text-white hover:bg-brand-2">
            <Link href="/">Voltar para a lista</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <Button
                asChild
                variant="ghost"
                className="-ml-3 w-fit rounded-full px-3 text-stone-600 hover:bg-brand-6/30 hover:text-brand-1"
              >
                <Link href="/">
                  <ArrowLeft />
                  Voltar
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-semibold text-brand-1 sm:text-4xl">
                  {giftId ? "Editar presente" : "Novo presente"}
                </h1>
                <p className="mt-2 text-sm text-stone-500">
                  {auth.profile.name ?? auth.profile.email}
                </p>
              </div>
            </div>

            <Badge className="w-fit rounded-full bg-brand-6 px-3 py-1 text-brand-1 shadow-none">
              Admin
            </Badge>
          </div>

          {feedback ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {feedback}
            </p>
          ) : null}

          {isGiftLoading ? (
            <div className="py-12 text-sm text-stone-600">Carregando presente...</div>
          ) : giftId && !gift ? (
            <div className="py-12 text-sm text-stone-600">Presente nao encontrado.</div>
          ) : (
            <GiftForm
              gift={gift ?? undefined}
              isSubmitting={isSubmitting || auth.isSigningOut}
              onCancel={() => router.push("/")}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  )
}
