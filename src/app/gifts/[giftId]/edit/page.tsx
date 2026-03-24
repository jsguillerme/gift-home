import { GiftEditorPage } from "@/src/components/gifts/gift-editor-page"

export default async function EditGiftPage({
  params,
}: {
  params: Promise<{ giftId: string }>
}) {
  const { giftId } = await params

  return <GiftEditorPage giftId={giftId} />
}
