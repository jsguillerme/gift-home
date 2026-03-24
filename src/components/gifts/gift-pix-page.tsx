"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, QrCode, Receipt } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { QrCodePix } from "qrcode-pix"

import { LoginScreen } from "@/src/components/auth/login-screen"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { pixConfig } from "@/src/config/pix"
import { useAuth } from "@/src/hooks/use-auth"
import { getGiftById, getGiftErrorMessage } from "@/src/services/gifts"
import type { Gift } from "@/src/types/gift"

interface GiftPixPageProps {
  giftId?: string
}

function buildTransactionId(giftId?: string) {
  const normalizedId = (giftId ?? "PIX").replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
  const prefix = pixConfig.transactionIdPrefix.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()

  return `${prefix}${normalizedId}`.slice(0, 25) || "GIFTPIX"
}

function formatMoney(value: number | null) {
  if (value === null) {
    return null
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function GiftPixPage({ giftId }: GiftPixPageProps) {
  const auth = useAuth()
  const router = useRouter()
  const [gift, setGift] = useState<Gift | null>(null)
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [feedback, setFeedback] = useState<string | null>(null)
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)
  const [pixPayload, setPixPayload] = useState<string | null>(null)
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [isLoadingGift, setIsLoadingGift] = useState(true)
  const [isGeneratingQr, setIsGeneratingQr] = useState(false)

  useEffect(() => {
    if (!auth.isAuthenticated || !giftId) {
      setIsLoadingGift(false)
      return
    }

    const currentGiftId = giftId
    let isMounted = true

    async function loadGift() {
      setIsLoadingGift(true)
      setFeedback(null)

      try {
        const currentGift = await getGiftById(currentGiftId)

        if (!isMounted) {
          return
        }

        setGift(currentGift)
        if (currentGift.price !== null) {
          setAmount(String(currentGift.price))
        }
        setMessage(currentGift.name ? `${pixConfig.message} - ${currentGift.name}`.slice(0, 99) : pixConfig.message)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setFeedback(getGiftErrorMessage(error))
      } finally {
        if (isMounted) {
          setIsLoadingGift(false)
        }
      }
    }

    void loadGift()

    return () => {
      isMounted = false
    }
  }, [auth.isAuthenticated, giftId])

  const numericAmount = (() => {
    if (!amount.trim()) {
      return null
    }

    const parsedAmount = Number(amount.replace(",", "."))
    return Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : null
  })()

  async function handleGenerateQr() {
    if (numericAmount === null) {
      setFeedback("Informe um valor valido em reais para gerar o PIX.")
      setPixPayload(null)
      setQrCodeImage(null)
      return
    }

    setIsGeneratingQr(true)
    setFeedback(null)

    try {
      const pixMessage = message.trim() || (gift ? `${pixConfig.message} - ${gift.name}`.slice(0, 99) : pixConfig.message)
      const qrCodePix = QrCodePix({
        version: "01",
        key: pixConfig.key,
        name: pixConfig.name,
        city: pixConfig.city,
        transactionId: buildTransactionId(gift?.id),
        message: pixMessage.slice(0, 99),
        cep: pixConfig.cep,
        value: numericAmount,
      })

      setPixPayload(qrCodePix.payload())
      const base64 = await qrCodePix.base64()
      setQrCodeImage(base64)
    } catch (error) {
      setFeedback(getGiftErrorMessage(error))
      setPixPayload(null)
      setQrCodeImage(null)
    } finally {
      setIsGeneratingQr(false)
    }
  }

  async function handleCopyPayload() {
    if (!pixPayload) {
      return
    }

    await navigator.clipboard.writeText(pixPayload)
    setCopyFeedback("Codigo PIX copiado.")
    window.setTimeout(() => setCopyFeedback(null), 2000)
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
                  Gerar PIX
                </h1>
                <p className="mt-2 text-sm text-stone-500">
                  {gift?.name ?? "Pagamento via PIX"}
                </p>
              </div>
            </div>

            <Badge className="w-fit rounded-full bg-brand-6 px-3 py-1 text-brand-1 shadow-none">
              PIX
            </Badge>
          </div>

          {feedback ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {feedback}
            </p>
          ) : null}

          {copyFeedback ? (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {copyFeedback}
            </p>
          ) : null}

          {isLoadingGift ? (
            <div className="py-12 text-sm text-stone-600">Carregando presente...</div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-brand-1">Valor em reais</p>
                  <input
                    id="pix-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="150.99"
                    className="h-12 w-full border-x-0 border-t-0 border-b border-brand-5 bg-transparent px-0 text-sm shadow-none outline-none focus:border-brand-2"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-brand-1">Mensagem do PIX</p>
                  <input
                    id="pix-message"
                    type="text"
                    maxLength={99}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Sejam felizes!"
                    className="h-12 w-full border-x-0 border-t-0 border-b border-brand-5 bg-transparent px-0 text-sm shadow-none outline-none focus:border-brand-2"
                  />
                </div>

                <div className="space-y-3 text-sm text-stone-600">
                  <div className="flex items-center justify-between gap-4 border-b border-brand-6 pb-3">
                    <span>Destino</span>
                    <span className="text-right font-medium text-brand-1">{pixConfig.name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-brand-6 pb-3">
                    <span>Categoria</span>
                    <span className="text-right font-medium text-brand-1">{gift?.category || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-brand-6 pb-3">
                    <span>Referencia</span>
                    <span className="text-right font-medium text-brand-1">{formatMoney(gift?.price ?? null) ?? "-"}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    className="h-11 rounded-full bg-brand-1 px-6 text-white hover:bg-brand-2"
                    onClick={handleGenerateQr}
                    disabled={isGeneratingQr}
                  >
                    <QrCode />
                    {isGeneratingQr ? "Gerando..." : "Gerar QR Code PIX"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-full border-brand-5 bg-transparent px-5 text-stone-700 hover:bg-brand-6/30"
                    onClick={() => router.push("/")}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex min-h-80 items-center justify-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  {pixPayload ? (
                    <QRCodeSVG
                      value={pixPayload}
                      size={280}
                      includeMargin
                      imageSettings={
                        pixConfig.logoSrc
                          ? {
                              src: pixConfig.logoSrc,
                              excavate: true,
                              height: 44,
                              width: 44,
                            }
                          : undefined
                      }
                    />
                  ) : (
                    <div className="max-w-xs text-center text-sm text-stone-500">
                      Informe o valor, ajuste a mensagem se quiser e clique em gerar para criar o QR Code do PIX.
                    </div>
                  )}
                </div>

                {pixPayload ? (
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-1">
                        <Receipt className="h-4 w-4" />
                        Codigo copia e cola
                      </div>
                      <p className="break-all text-xs leading-6 text-stone-600">
                        {pixPayload}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full border-brand-5 bg-transparent px-5 text-stone-700 hover:bg-brand-6/30"
                        onClick={handleCopyPayload}
                      >
                        <Copy />
                        Copiar codigo PIX
                      </Button>

                      {qrCodeImage ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 rounded-full border-brand-5 bg-transparent px-5 text-stone-700 hover:bg-brand-6/30"
                          asChild
                        >
                          <a href={qrCodeImage} download={`pix-${gift?.id ?? "geral"}.png`}>
                            Baixar imagem
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
