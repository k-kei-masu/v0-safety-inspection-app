"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ClipboardCheck } from "lucide-react"
import { clearInspectionData } from "@/lib/storage"

export default function MenuPage() {
  const router = useRouter()

  const handleStartInspection = () => {
    clearInspectionData()
    router.push("/basic-info")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary/10 to-background">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary p-6 shadow-lg">
            <ClipboardCheck className="h-16 w-16 text-primary-foreground" />
          </div>
          <h1 className="text-center text-3xl font-black text-foreground">安全パトロールシステム</h1>
          <p className="text-center text-base text-muted-foreground">地中線・配電工事用</p>
        </div>

        <Button size="lg" onClick={handleStartInspection} className="h-16 w-full max-w-sm text-lg font-bold shadow-lg">
          パトロール開始
        </Button>
      </div>

      <footer className="pb-8 text-center text-sm text-muted-foreground">v1.0.0</footer>
    </div>
  )
}
