"use client"

import { useEffect, useState } from "react"
import { Pencil, Plus } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import type { Gift, GiftFormValues } from "@/src/types/gift"

interface GiftFormDialogProps {
  gift?: Gift
  isSubmitting?: boolean
  onSubmit: (values: {
    name: string
    color?: string | null
    description?: string | null
    imageUrl?: string | null
    price?: number | null
    link?: string | null
  }) => Promise<boolean> | boolean
}

function toFormValues(gift?: Gift): GiftFormValues {
  return {
    name: gift?.name ?? "",
    color: gift?.color ?? "",
    description: gift?.description ?? "",
    imageUrl: gift?.imageUrl ?? "",
    price: gift?.price !== null && gift?.price !== undefined ? String(gift.price) : "",
    link: gift?.link ?? "",
  }
}

export function GiftFormDialog({
  gift,
  isSubmitting = false,
  onSubmit,
}: GiftFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [formValues, setFormValues] = useState<GiftFormValues>(toFormValues(gift))

  useEffect(() => {
    setFormValues(toFormValues(gift))
  }, [gift])

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)

    if (!nextOpen) {
      setFormValues(toFormValues(gift))
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formValues.name.trim()) {
      return
    }

    const didSave = await onSubmit({
      name: formValues.name,
      color: formValues.color,
      description: formValues.description,
      imageUrl: formValues.imageUrl,
      price: formValues.price ? Number(formValues.price) : null,
      link: formValues.link,
    })

    if (!didSave) {
      return
    }

    if (!gift) {
      setFormValues(toFormValues())
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-brand-1 text-white shadow-sm hover:bg-brand-2"
          disabled={isSubmitting}
        >
          {gift ? <Pencil className="mr-2" /> : <Plus className="mr-2" />}
          {gift ? "Editar presente" : "Adicionar presente"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2rem)] rounded-[1.75rem] border border-brand-6/30 bg-linear-to-b from-white to-brand-6/10 p-0 shadow-xl sm:max-w-2xl">
        <form className="space-y-6 px-5 py-5 sm:px-6 sm:py-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <section className="space-y-4 rounded-2xl border border-brand-6/30 bg-white/90 p-4 shadow-sm shadow-brand-1/5">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-brand-1">Informacoes principais</h3>
                <p className="text-sm leading-6 text-stone-500">
                  Comece pelo essencial para deixar a lista clara e facil de entender.
                </p>
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-brand-1" htmlFor="gift-name">
                  Nome do presente *
                </Label>
                <Input
                  id="gift-name"
                  value={formValues.name}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Ex: Cafeteira, Jogo de pratos..."
                  className="h-11 rounded-xl border-brand-6/40 bg-white px-3.5 text-sm shadow-xs placeholder:text-stone-400 focus-visible:border-brand-3 focus-visible:ring-brand-4/15"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-brand-1" htmlFor="gift-color">
                    Cor do presente
                  </Label>
                  <Input
                    id="gift-color"
                    value={formValues.color}
                    onChange={(event) =>
                      setFormValues((current) => ({ ...current, color: event.target.value }))
                    }
                    placeholder="Ex: Azul, Preto, Rosa..."
                    className="h-11 rounded-xl border-brand-6/40 bg-white px-3.5 text-sm shadow-xs placeholder:text-stone-400 focus-visible:border-brand-3 focus-visible:ring-brand-4/15"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-brand-1" htmlFor="gift-price">
                    Preco
                  </Label>
                  <Input
                    id="gift-price"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={formValues.price}
                    onChange={(event) =>
                      setFormValues((current) => ({ ...current, price: event.target.value }))
                    }
                    placeholder="199.90"
                    className="h-11 rounded-xl border-brand-6/40 bg-white px-3.5 text-sm shadow-xs placeholder:text-stone-400 focus-visible:border-brand-3 focus-visible:ring-brand-4/15"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-brand-6/30 bg-white/90 p-4 shadow-sm shadow-brand-1/5">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-brand-1">Detalhes extras</h3>
                <p className="text-sm leading-6 text-stone-500">
                  Informacoes complementares deixam a escolha mais confortavel para quem vai presentear.
                </p>
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-brand-1" htmlFor="gift-description">
                  Descricao
                </Label>
                <Textarea
                  id="gift-description"
                  value={formValues.description}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Detalhes importantes, tamanho, modelo ou observacoes uteis"
                  rows={4}
                  className="min-h-28 rounded-xl border-brand-6/40 bg-white px-3.5 py-3 text-sm leading-6 shadow-xs placeholder:text-stone-400 focus-visible:border-brand-3 focus-visible:ring-brand-4/15"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-brand-1" htmlFor="gift-link">
                  Link do produto
                </Label>
                <Input
                  id="gift-link"
                  type="url"
                  value={formValues.link}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, link: event.target.value }))
                  }
                  placeholder="https://..."
                  className="h-11 rounded-xl border-brand-6/40 bg-white px-3.5 text-sm shadow-xs placeholder:text-stone-400 focus-visible:border-brand-3 focus-visible:ring-brand-4/15"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-brand-1" htmlFor="gift-image">
                  URL da imagem
                </Label>
                <Input
                  id="gift-image"
                  type="url"
                  value={formValues.imageUrl}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, imageUrl: event.target.value }))
                  }
                  placeholder="https://..."
                  className="h-11 rounded-xl border-brand-6/40 bg-white px-3.5 text-sm shadow-xs placeholder:text-stone-400 focus-visible:border-brand-3 focus-visible:ring-brand-4/15"
                />
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-2 border-t border-brand-6/30 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-xl border-brand-6/40 bg-white text-stone-700 hover:bg-brand-6/10 sm:flex-none sm:px-5"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-11 flex-1 rounded-xl bg-brand-1 text-white shadow-sm hover:bg-brand-2 sm:flex-none sm:px-5"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : gift ? "Salvar" : "Criar presente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
