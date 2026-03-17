"use client"

import Image from "next/image"
import { Banknote, Check, ExternalLink, Gift, Trash2, Undo2 } from "lucide-react"

import { GiftFormDialog } from "@/src/components/gifts/gift-form-dialog"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import type { Gift as GiftType, GiftMutationInput } from "@/src/types/gift"

interface GiftCardProps {
  gift: GiftType
  currentUserId?: string
  isAdmin: boolean
  isSubmitting?: boolean
  onClearReservation?: (giftId: string) => Promise<void> | void
  onDelete?: (giftId: string) => Promise<void> | void
  onReserve?: (giftId: string) => Promise<void> | void
  onUnreserve?: (giftId: string) => Promise<void> | void
  onUpdate?: (giftId: string, payload: GiftMutationInput) => Promise<boolean> | boolean
}

function formatPrice(price: number | null) {
  if (price === null) {
    return null
  }

  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(price)
}

export function GiftCard({
  gift,
  currentUserId,
  isAdmin,
  isSubmitting = false,
  onClearReservation,
  onDelete,
  onReserve,
  onUnreserve,
  onUpdate,
}: GiftCardProps) {
  const isReserved = gift.status === "reserved"
  const isReservedByCurrentUser = gift.reservedByUserId === currentUserId
  const priceLabel = formatPrice(gift.price)

  async function handleDelete() {
    if (!onDelete) {
      return
    }

    if (!window.confirm(`Deseja remover o presente "${gift.name}"?`)) {
      return
    }

    await onDelete(gift.id)
  }

  return (
    <Card
      className={`flex h-full flex-col border-brand-5/40 shadow-sm ${isReserved ? "opacity-90" : ""}`}
    >
      <div className="relative shrink-0">
        {gift.imageUrl ? (
          <Image
            src={gift.imageUrl}
            alt={gift.name}
            width={640}
            height={320}
            className="h-32 w-full object-scale-down"
          />
        ) : (
          <div className="flex h-28 w-full items-center justify-center bg-linear-to-br from-brand-6 to-brand-5">
            <Gift className="h-20 w-20 text-brand-1/40" />
          </div>
        )}

        <div className="absolute right-1.5 top-1.5">
          <Badge
            className={`text-[10px] leading-tight ${isReserved ? "bg-brand-1 text-white" : "bg-white text-stone-700"}`}
          >
            {isReserved ? "Reservado" : "Disponivel"}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-2.5">
        <div className="min-h-0 flex-1 space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-brand-1">
            {gift.name}
          </h3>
          {gift.color ? (
            <div className="inline-flex items-center rounded-full bg-brand-6/20 px-1.5 py-0.5 text-[10px] font-medium text-brand-2">
              Cor: {gift.color}
            </div>
          ) : null}
          {gift.description ? (
            <p className="line-clamp-2 text-[11px] leading-snug text-stone-600">
              {gift.description}
            </p>
          ) : null}
          {priceLabel ? (
            <p className="flex items-center gap-1 text-sm font-semibold text-brand-2">
              <Banknote className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {priceLabel}
            </p>
          ) : null}
          {gift.reservedByName ? (
            <p className="text-[10px] text-stone-500">
              Reservado por {gift.reservedByName}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap gap-1">
          {gift.link ? (
            <Button size="sm" variant="outline" asChild>
              <a href={gift.link} target="_blank" rel="noreferrer">
                <ExternalLink />
              </a>
            </Button>
          ) : null}

          {isAdmin ? (
            <>
              {onUpdate ? (
                <GiftFormDialog
                  gift={gift}
                  isSubmitting={isSubmitting}
                  onSubmit={(payload) => onUpdate(gift.id, payload)}
                />
              ) : null}
              {isReserved && onClearReservation ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onClearReservation(gift.id)}
                  disabled={isSubmitting}
                >
                  <Undo2 />
                </Button>
              ) : null}
              {onDelete ? (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  <Trash2 />
                </Button>
              ) : null}
            </>
          ) : null}

          {!isAdmin && !isReserved && onReserve ? (
            <Button size="sm" onClick={() => onReserve(gift.id)} disabled={isSubmitting}>
              <Check />
            </Button>
          ) : null}

          {!isAdmin && isReservedByCurrentUser && onUnreserve ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUnreserve(gift.id)}
              disabled={isSubmitting}
            >
              <Undo2 />
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
