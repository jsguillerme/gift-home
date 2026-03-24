import { GiftPixPage } from "@/src/components/gifts/gift-pix-page"

export default async function GiftPixRoute({
  params,
}: {
  params: Promise<{ giftId: string }>
}) {
  const { giftId } = await params

  return <GiftPixPage giftId={giftId} />
}
