export type GiftStatus = "available" | "reserved"

export interface Gift {
  id: string
  name: string
  color: string | null
  description: string | null
  imageUrl: string | null
  price: number | null
  link: string | null
  status: GiftStatus
  reservedByUserId: string | null
  reservedByName: string | null
  createdAt: string
  updatedAt: string
}

export interface GiftFormValues {
  name: string
  color: string
  description: string
  imageUrl: string
  price: string
  link: string
}

export interface GiftMutationInput {
  name: string
  color?: string | null
  description?: string | null
  imageUrl?: string | null
  price?: number | null
  link?: string | null
}
