"use client"

import { useEffect, useState } from "react"
import { Pencil, Plus } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
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
    description?: string | null
    imageUrl?: string | null
    price?: number | null
    link?: string | null
  }) => Promise<void> | void
}

function toFormValues(gift?: Gift): GiftFormValues {
  return {
    name: gift?.name ?? "",
    description: gift?.description ?? "",
    imageUrl: gift?.imageUrl ?? "",
    price: gift?.price ? String(gift.price) : "",
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formValues.name.trim()) {
      return
    }

    await onSubmit({
      name: formValues.name,
      description: formValues.description,
      imageUrl: formValues.imageUrl,
      price: formValues.price ? Number(formValues.price) : null,
      link: formValues.link,
    })

    if (!gift) {
      setFormValues(toFormValues())
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-brand-1 text-white hover:bg-brand-2"
          disabled={isSubmitting}
        >
          {gift ? <Pencil className="mr-2" /> : <Plus className="mr-2" />}
          {gift ? "Editar presente" : "Adicionar presente"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-brand-1">
            {gift ? "Editar presente" : "Novo presente"}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="gift-name">Nome *</Label>
            <Input
              id="gift-name"
              value={formValues.name}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Ex.: Cafeteira"
              required
            />
          </div>

          <div>
            <Label htmlFor="gift-description">Descricao</Label>
            <Textarea
              id="gift-description"
              value={formValues.description}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Detalhes importantes sobre o presente"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="gift-price">Preco</Label>
              <Input
                id="gift-price"
                type="number"
                min="0"
                step="0.01"
                value={formValues.price}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, price: event.target.value }))
                }
                placeholder="199.90"
              />
            </div>
            <div>
              <Label htmlFor="gift-link">Link</Label>
              <Input
                id="gift-link"
                type="url"
                value={formValues.link}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, link: event.target.value }))
                }
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="gift-image">URL da imagem</Label>
            <Input
              id="gift-image"
              type="url"
              value={formValues.imageUrl}
              onChange={(event) =>
                setFormValues((current) => ({ ...current, imageUrl: event.target.value }))
              }
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : gift ? "Salvar" : "Criar presente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
