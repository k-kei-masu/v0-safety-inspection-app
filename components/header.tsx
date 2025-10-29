"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  onBack?: () => void
  showBack?: boolean
}

export function Header({ title, onBack, showBack = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="flex items-center gap-3 px-4 py-4">
        {showBack && onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-11 w-11 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">戻る</span>
          </Button>
        )}
        <h1 className="text-xl font-bold leading-tight">{title}</h1>
      </div>
    </header>
  )
}
