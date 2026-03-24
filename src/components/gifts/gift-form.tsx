"use client"

import { useEffect, useState } from "react"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import type { Gift, GiftFormValues } from "@/src/types/gift"

const categoryOptions = ["cozinha", "banheiro", "quarto", "sala"] as const

interface GiftFormProps {
  gift?: Gift
  isSubmitting?: boolean
  onCancel: () => void
  onSubmit: (values: {
    name: string
    category: string
    color?: string | null
    description?: string | null
    imageUrl?: string | null
    price?: number | null
    link?: string | null
  }) => Promise<void> | void
}

function toFormValues(gift?: Gift): GiftFormValues {
  return {
    name: gift?.name ?? "",
    category: gift?.category ?? "",
    color: gift?.color ?? "",
    description: gift?.description ?? "",
    imageUrl: gift?.imageUrl ?? "",
    price: gift?.price !== null && gift?.price !== undefined ? String(gift.price) : "",
    link: gift?.link ?? "",
  }
}

export function GiftForm({
  gift,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: GiftFormProps) {
  const [formValues, setFormValues] = useState<GiftFormValues>(toFormValues(gift))
  const hasCustomCategory =
    Boolean(formValues.category) && !categoryOptions.includes(formValues.category as (typeof categoryOptions)[number])

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
      category: formValues.category,
      color: formValues.color,
      description: formValues.description,
      imageUrl: formValues.imageUrl,
      price: formValues.price ? Number(formValues.price) : null,
      link: formValues.link,
    })
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
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
            className="h-12 border-x-0 border-t-0 border-b border-brand-5 bg-transparent px-0 text-sm shadow-none placeholder:text-stone-400 focus-visible:border-brand-2 focus-visible:ring-0"
            required
          />
        </div>

        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-brand-1" htmlFor="gift-category">
            Categoria
          </Label>
          <select
            id="gift-category"
            value={formValues.category}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, category: event.target.value }))
            }
            className="h-12 w-full rounded-none border-x-0 border-t-0 border-b border-brand-5 bg-transparent px-0 text-sm text-foreground outline-none focus:border-brand-2"
          >
            <option value="">Selecione uma categoria</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            {hasCustomCategory ? (
              <option value={formValues.category}>{formValues.category}</option>
            ) : null}
          </select>
        </div>

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
            className="h-12 border-x-0 border-t-0 border-b border-brand-5 bg-transparent px-0 text-sm shadow-none placeholder:text-stone-400 focus-visible:border-brand-2 focus-visible:ring-0"
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
            className="h-12 border-x-0 border-t-0 border-b border-brand-5 bg-transparent px-0 text-sm shadow-none placeholder:text-stone-400 focus-visible:border-brand-2 focus-visible:ring-0"
          />
        </div>
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
          rows={5}
          className="min-h-32 resize-y border-x-0 border-t-0 border-b border-brand-5 bg-transparent px-0 py-2 text-sm leading-6 shadow-none placeholder:text-stone-400 focus-visible:border-brand-2 focus-visible:ring-0"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
            className="h-12 border-x-0 border-t-0 border-b border-brand-5 bg-transparent px-0 text-sm shadow-none placeholder:text-stone-400 focus-visible:border-brand-2 focus-visible:ring-0"
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
            className="h-12 border-x-0 border-t-0 border-b border-brand-5 bg-transparent px-0 text-sm shadow-none placeholder:text-stone-400 focus-visible:border-brand-2 focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-full border-brand-5 bg-transparent px-5 text-stone-700 hover:bg-brand-6/30"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="h-11 rounded-full bg-brand-1 px-6 text-white hover:bg-brand-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : gift ? "Salvar" : "Criar presente"}
        </Button>
      </div>
    </form>
  )
}
