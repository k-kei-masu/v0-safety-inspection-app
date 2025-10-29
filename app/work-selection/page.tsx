"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Cake as Crane, Drill, Zap, CircleDot, Wrench } from "lucide-react"
import { loadInspectionData, saveInspectionData } from "@/lib/storage"
import { defaultCategories } from "@/lib/inspection-data"
import type { InspectionData, WorkType } from "@/lib/types"

const workTypeIcons = {
  crane: Crane,
  excavation: Drill,
  "utility-pole": Zap,
  manhole: CircleDot,
  other: Wrench,
}

export default function WorkSelectionPage() {
  const router = useRouter()
  const [inspectionData, setInspectionData] = useState<InspectionData | null>(null)
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<Set<string>>(new Set())

  useEffect(() => {
    const data = loadInspectionData()
    if (!data?.basicInfo) {
      router.push("/basic-info")
      return
    }
    setInspectionData(data)

    const preSelected = new Set(data.workTypes.filter((wt) => wt.status !== "not-started").map((wt) => wt.id))
    setSelectedWorkTypes(preSelected)
  }, [router])

  const toggleWorkType = (workTypeId: string) => {
    setSelectedWorkTypes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(workTypeId)) {
        newSet.delete(workTypeId)
      } else {
        newSet.add(workTypeId)
      }
      return newSet
    })
  }

  const handleNext = () => {
    if (!inspectionData) return

    const updatedWorkTypes: WorkType[] = inspectionData.workTypes.map((workType) => {
      if (selectedWorkTypes.has(workType.id)) {
        return {
          ...workType,
          status: workType.status === "not-started" ? "in-progress" : workType.status,
          categories: workType.categories.length > 0 ? workType.categories : defaultCategories,
        }
      }
      return workType
    })

    const updatedData: InspectionData = {
      ...inspectionData,
      workTypes: updatedWorkTypes,
    }

    saveInspectionData(updatedData)

    const firstSelectedId = Array.from(selectedWorkTypes)[0]
    if (firstSelectedId) {
      router.push(`/checklist/${firstSelectedId}`)
    }
  }

  const handleFinish = () => {
    router.push("/summary")
  }

  const hasCompletedWork = inspectionData?.workTypes.some((wt) => wt.status === "completed") || false

  if (!inspectionData) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-card px-4 py-3 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.push("/basic-info")} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">作業種別選択</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-md space-y-6">
          <p className="text-center text-sm text-muted-foreground">点検する作業を選択してください</p>

          <div className="space-y-3">
            {inspectionData.workTypes.map((workType) => {
              const Icon = workTypeIcons[workType.id as keyof typeof workTypeIcons] || Wrench
              const isSelected = selectedWorkTypes.has(workType.id)

              return (
                <Card
                  key={workType.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? "border-primary bg-primary/5 shadow-md" : "hover:border-primary/50"
                  }`}
                  onClick={() => toggleWorkType(workType.id)}
                >
                  <div className="flex items-center gap-4 p-5">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleWorkType(workType.id)}
                      className="h-6 w-6"
                    />
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-foreground">{workType.name}</h3>
                      {workType.status === "completed" && <p className="text-xs text-success">✓ 完了</p>}
                      {workType.status === "in-progress" && <p className="text-xs text-warning">進行中</p>}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card px-4 py-4 shadow-lg">
        <div className="flex gap-3">
          <Button
            onClick={handleNext}
            disabled={selectedWorkTypes.size === 0}
            size="lg"
            className="h-14 flex-1 text-base font-bold"
          >
            点検開始
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            onClick={handleFinish}
            disabled={!hasCompletedWork}
            variant="outline"
            size="lg"
            className="h-14 flex-1 text-base font-bold bg-transparent"
          >
            点検完了
          </Button>
        </div>
      </footer>
    </div>
  )
}
