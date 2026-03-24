"use client"

import Link from "next/link"
import { Copy, MapPin, QrCode } from "lucide-react"

import { Button } from "@/src/components/ui/button"

interface GiftListToolbarProps {
  categoryOptions: string[]
  selectedCategory: string
  onCategoryChange: (value: string) => void
}

export function GiftListToolbar({
  categoryOptions,
  selectedCategory,
  onCategoryChange,
}: GiftListToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/55 p-3 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-start gap-2 text-sm leading-6 text-stone-600">
        <MapPin size={16} className="mt-1 shrink-0 text-brand-1" />
        <span className="min-w-0">
          Rua 113, nº 71, Bairro Timbó, CEP 61936-130, Maracanaú – CE.
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        <Button
          onClick={() => navigator.clipboard.writeText("61936130")}
          variant="outline"
          className="h-9 rounded-full border-brand-5 bg-white/80 px-3 text-sm text-stone-600 hover:cursor-pointer hover:border-brand-1 hover:bg-brand-6/30 hover:text-brand-1"
        >
          <Copy size={16} />
          Copiar CEP
        </Button>

        <label className="flex items-center gap-2 rounded-full border border-brand-5 bg-white/80 px-3 text-sm text-stone-600">
          <span className="shrink-0 text-xs font-medium text-brand-1">Categoria</span>
          <select
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="h-9 w-full bg-transparent text-sm text-foreground outline-none"
          >
            <option value="all">Todas</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <Button asChild variant="outline" className="h-9 rounded-full border-brand-5 bg-white/80 px-4 text-sm hover:bg-brand-6/30">
          <Link href="/pix">
            <QrCode />
            Gerar PIX
          </Link>
        </Button>
      </div>
    </div>
  )
}
