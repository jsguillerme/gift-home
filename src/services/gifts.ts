"use client"

import { PostgrestError } from "@supabase/supabase-js"

import { getSupabaseBrowserClient } from "@/src/lib/supabase/client"
import type { Gift, GiftMutationInput } from "@/src/types/gift"

type GiftRow = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  price: number | null
  link: string | null
  status: "available" | "reserved"
  reserved_by_user_id: string | null
  created_at: string
  updated_at: string
  reserved_by: Array<{ name: string | null }> | null
}

function mapGift(row: GiftRow): Gift {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    price: row.price,
    link: row.link,
    status: row.status,
    reservedByUserId: row.reserved_by_user_id,
    reservedByName: row.reserved_by?.[0]?.name ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function normalizeGiftPayload(payload: GiftMutationInput) {
  return {
    name: payload.name.trim(),
    description: payload.description?.trim() || null,
    image_url: payload.imageUrl?.trim() || null,
    price: payload.price ?? null,
    link: payload.link?.trim() || null,
  }
}

export async function getGifts() {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("gifts")
    .select(
      "id, name, description, image_url, price, link, status, reserved_by_user_id, created_at, updated_at, reserved_by:users!gifts_reserved_by_user_id_fkey(name)"
    )
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map((gift) => mapGift(gift as GiftRow))
}

export async function createGift(payload: GiftMutationInput) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("gifts")
    .insert({
      ...normalizeGiftPayload(payload),
      status: "available",
      reserved_by_user_id: null,
    })
    .select(
      "id, name, description, image_url, price, link, status, reserved_by_user_id, created_at, updated_at, reserved_by:users!gifts_reserved_by_user_id_fkey(name)"
    )
    .single()

  if (error) {
    throw error
  }

  return mapGift(data as GiftRow)
}

export async function updateGift(giftId: string, payload: GiftMutationInput) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("gifts")
    .update({
      ...normalizeGiftPayload(payload),
      updated_at: new Date().toISOString(),
    })
    .eq("id", giftId)
    .select(
      "id, name, description, image_url, price, link, status, reserved_by_user_id, created_at, updated_at, reserved_by:users!gifts_reserved_by_user_id_fkey(name)"
    )
    .single()

  if (error) {
    throw error
  }

  return mapGift(data as GiftRow)
}

export async function deleteGift(giftId: string) {
  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.from("gifts").delete().eq("id", giftId)

  if (error) {
    throw error
  }
}

export async function reserveGift(giftId: string, userId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("gifts")
    .update({
      status: "reserved",
      reserved_by_user_id: userId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", giftId)
    .eq("status", "available")
    .is("reserved_by_user_id", null)
    .select("id")
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error("Este presente acabou de ser reservado por outra pessoa.")
  }
}

export async function unreserveGift(giftId: string, userId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("gifts")
    .update({
      status: "available",
      reserved_by_user_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", giftId)
    .eq("status", "reserved")
    .eq("reserved_by_user_id", userId)
    .select("id")
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error("Sua reserva nao pode ser cancelada porque o presente mudou de estado.")
  }
}

export async function clearGiftReservation(giftId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("gifts")
    .update({
      status: "available",
      reserved_by_user_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", giftId)
    .select("id")
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error("Nao foi possivel liberar a reserva do presente.")
  }
}

export function getGiftErrorMessage(error: unknown) {
  if (error instanceof PostgrestError) {
    return error.message
  }

  if (typeof error === "object" && error && "message" in error) {
    return String(error.message)
  }

  return "Nao foi possivel atualizar os presentes."
}
