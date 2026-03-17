"use client"

import { Gift, Heart } from "lucide-react"

import { GiftCard } from "@/src/components/gifts/gift-card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import type { AppUser } from "@/src/types/auth"
import type { Gift as GiftType } from "@/src/types/gift"

interface UserDashboardProps {
  feedback?: { message: string; type: "success" | "error" } | null
  gifts: GiftType[]
  isLoading?: boolean
  isSubmitting?: boolean
  onLogout: () => Promise<void> | void
  onReserveGift: (giftId: string) => Promise<void> | void
  onUnreserveGift: (giftId: string) => Promise<void> | void
  user: AppUser
}

export function UserDashboard({
  feedback,
  gifts,
  isLoading = false,
  isSubmitting = false,
  onLogout,
  onReserveGift,
  onUnreserveGift,
  user,
}: UserDashboardProps) {
  const availableGifts = gifts.filter((gift) => gift.status === "available")
  const reservedByUser = gifts.filter((gift) => gift.reservedByUserId === user.id)

  return (
    <div className="min-h-screen bg-linear-to-br from-brand-6/30 via-brand-5/10 to-brand-6/5 pb-8">
      <div className="sticky top-0 z-10 bg-white/90 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-linear-to-br from-brand-1 to-brand-2 p-3">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="bg-linear-to-r from-brand-1 to-brand-3 bg-clip-text text-2xl font-bold text-transparent">
                Lista de presentes
              </h1>
              <p className="text-sm text-stone-600">
                {user.name ?? user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-brand-6/30 text-brand-2 hover:bg-brand-6/30">
              <Heart className="mr-1" />
              Convidado
            </Badge>
            <Button variant="outline" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {feedback ? (
          <p
            className={`mb-4 rounded-lg px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {feedback.message}
          </p>
        ) : null}

        <Tabs defaultValue="available">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">
              Disponiveis ({availableGifts.length})
            </TabsTrigger>
            <TabsTrigger value="all">Todos ({gifts.length})</TabsTrigger>
            <TabsTrigger value="mine">Minhas reservas ({reservedByUser.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            <GiftGrid
              gifts={availableGifts}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              userId={user.id}
              onReserveGift={onReserveGift}
              onUnreserveGift={onUnreserveGift}
            />
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <GiftGrid
              gifts={gifts}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              userId={user.id}
              onReserveGift={onReserveGift}
              onUnreserveGift={onUnreserveGift}
            />
          </TabsContent>

          <TabsContent value="mine" className="mt-6">
            <GiftGrid
              gifts={reservedByUser}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              userId={user.id}
              onReserveGift={onReserveGift}
              onUnreserveGift={onUnreserveGift}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function GiftGrid({
  gifts,
  isLoading,
  isSubmitting,
  onReserveGift,
  onUnreserveGift,
  userId,
}: {
  gifts: GiftType[]
  isLoading: boolean
  isSubmitting: boolean
  onReserveGift: (giftId: string) => Promise<void> | void
  onUnreserveGift: (giftId: string) => Promise<void> | void
  userId: string
}) {
  if (isLoading) {
    return <p className="text-sm text-stone-600">Carregando presentes...</p>
  }

  if (!gifts.length) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-sm text-stone-600 shadow-sm">
        Nenhum presente nesta lista.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {gifts.map((gift) => (
        <GiftCard
          key={gift.id}
          gift={gift}
          currentUserId={userId}
          isAdmin={false}
          isSubmitting={isSubmitting}
          onReserve={onReserveGift}
          onUnreserve={onUnreserveGift}
        />
      ))}
    </div>
  )
}
