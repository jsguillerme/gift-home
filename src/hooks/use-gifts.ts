"use client"

import { useEffect, useState } from "react"

import {
  clearGiftReservation,
  createGift,
  deleteGift,
  getGiftErrorMessage,
  getGifts,
  reserveGift,
  unreserveGift,
  updateGift,
} from "@/src/services/gifts"
import type { Gift, GiftMutationInput } from "@/src/types/gift"

type Feedback =
  | {
      type: "success" | "error"
      message: string
    }
  | null

export function useGifts(enabled: boolean) {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  useEffect(() => {
    async function loadGifts() {
      if (!enabled) {
        setGifts([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const nextGifts = await getGifts()
        setGifts(nextGifts)
      } catch (error) {
        setFeedback({
          type: "error",
          message: getGiftErrorMessage(error),
        })
      } finally {
        setIsLoading(false)
      }
    }

    void loadGifts()
  }, [enabled])

  async function runAction(action: () => Promise<void>, successMessage: string) {
    setIsSubmitting(true)
    setFeedback(null)

    try {
      await action()
      const nextGifts = await getGifts()
      setGifts(nextGifts)
      setFeedback({
        type: "success",
        message: successMessage,
      })
    } catch (error) {
      setFeedback({
        type: "error",
        message: getGiftErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    clearFeedback: () => setFeedback(null),
    createGift: (payload: GiftMutationInput) =>
      runAction(() => createGift(payload).then(() => undefined), "Presente criado com sucesso."),
    deleteGift: (giftId: string) =>
      runAction(() => deleteGift(giftId), "Presente removido com sucesso."),
    feedback,
    gifts,
    isLoading,
    isSubmitting,
    reserveGift: (giftId: string, userId: string) =>
      runAction(() => reserveGift(giftId, userId), "Presente reservado com sucesso."),
    unreserveGift: (giftId: string, userId: string) =>
      runAction(() => unreserveGift(giftId, userId), "Reserva cancelada com sucesso."),
    clearGiftReservation: (giftId: string) =>
      runAction(() => clearGiftReservation(giftId), "Reserva liberada com sucesso."),
    updateGift: (giftId: string, payload: GiftMutationInput) =>
      runAction(() => updateGift(giftId, payload).then(() => undefined), "Presente atualizado com sucesso."),
  }
}
