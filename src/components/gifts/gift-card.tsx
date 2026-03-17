"use client"

import Image from "next/image"
import { Check, ExternalLink, Gift, Trash2, Undo2 } from "lucide-react"

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
  onUpdate?: (giftId: string, payload: GiftMutationInput) => Promise<void> | void
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
    <Card className={`border-brand-5/40 shadow-sm ${isReserved ? "opacity-90" : ""}`}>
      <div className="relative">
        {gift.imageUrl ? (
          <Image
            src={gift.imageUrl}
            alt={gift.name}
            width={640}
            height={320}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-linear-to-br from-brand-6 to-brand-5">
            <Gift className="h-16 w-16 text-brand-1/40" />
          </div>
        )}

        <div className="absolute right-3 top-3">
          <Badge className={isReserved ? "bg-brand-1 text-white" : "bg-white text-stone-700"}>
            {isReserved ? "Reservado" : "Disponivel"}
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold text-brand-1">
            {gift.name}
          </h3>
          {gift.description ? (
            <p className="line-clamp-3 text-sm text-stone-600">{gift.description}</p>
          ) : null}
          {priceLabel ? (
            <p className="font-semibold text-brand-2">{priceLabel}</p>
          ) : null}
          {gift.reservedByName ? (
            <p className="text-xs text-stone-500">
              Reservado por {gift.reservedByName}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {gift.link ? (
            <Button variant="outline" asChild>
              <a href={gift.link} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2" />
                Ver produto
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
                  variant="outline"
                  onClick={() => onClearReservation(gift.id)}
                  disabled={isSubmitting}
                >
                  <Undo2 className="mr-2" />
                  Liberar reserva
                </Button>
              ) : null}
              {onDelete ? (
                <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                  <Trash2 className="mr-2" />
                  Remover
                </Button>
              ) : null}
            </>
          ) : null}

          {!isAdmin && !isReserved && onReserve ? (
            <Button onClick={() => onReserve(gift.id)} disabled={isSubmitting}>
              <Check className="mr-2" />
              Reservar
            </Button>
          ) : null}

          {!isAdmin && isReservedByCurrentUser && onUnreserve ? (
            <Button variant="outline" onClick={() => onUnreserve(gift.id)} disabled={isSubmitting}>
              <Undo2 className="mr-2" />
              Cancelar reserva
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
