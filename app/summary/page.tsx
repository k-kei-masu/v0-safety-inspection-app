"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Download, Home } from "lucide-react"
import { loadInspectionData, saveInspectionData, clearInspectionData } from "@/lib/storage"
import type { InspectionData } from "@/lib/types"

const ratingConfig = {
  good: {
    label: "良好",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  warning: {
    label: "注意",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  danger: {
    label: "危険",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
}

export default function SummaryPage() {
  const router = useRouter()
  const [inspectionData, setInspectionData] = useState<InspectionData | null>(null)
  const [finalComments, setFinalComments] = useState("")

  useEffect(() => {
    const data = loadInspectionData()
    if (!data?.basicInfo) {
      router.push("/basic-info")
      return
    }
    setInspectionData(data)
    setFinalComments(data.finalComments || "")
  }, [router])

  const handleCommentsChange = (comments: string) => {
    setFinalComments(comments)
    if (inspectionData) {
      const updatedData = { ...inspectionData, finalComments: comments }
      saveInspectionData(updatedData)
    }
  }

  const calculateStats = () => {
    if (!inspectionData) return { good: 0, warning: 0, danger: 0, total: 0 }

    const completedWorkTypes = inspectionData.workTypes.filter((wt) => wt.status === "completed")
    let good = 0
    let warning = 0
    let danger = 0
    let total = 0

    completedWorkTypes.forEach((workType) => {
      workType.categories.forEach((category) => {
        category.items.forEach((item) => {
          if (item.rating) {
            total++
            if (item.rating === "good") good++
            else if (item.rating === "warning") warning++
            else if (item.rating === "danger") danger++
          }
        })
      })
    })

    return { good, warning, danger, total }
  }

  const handleExport = () => {
    if (!inspectionData) return

    const stats = calculateStats()
    const completedWorkTypes = inspectionData.workTypes.filter((wt) => wt.status === "completed")

    let reportText = "=== 安全点検報告書 ===\n\n"
    reportText += "【基本情報】\n"
    reportText += `点検日: ${inspectionData.basicInfo?.date}\n`
    reportText += `現場名: ${inspectionData.basicInfo?.siteName}\n`
    reportText += `場所: ${inspectionData.basicInfo?.location}\n`
    reportText += `責任者: ${inspectionData.basicInfo?.supervisor}\n`
    reportText += `工事種別: ${inspectionData.basicInfo?.constructionType}\n`
    reportText += `作業員: ${inspectionData.basicInfo?.teamMembers.join(", ")}\n\n`

    reportText += "【点検結果サマリー】\n"
    reportText += `総点検項目数: ${stats.total}\n`
    reportText += `良好: ${stats.good} (${stats.total > 0 ? Math.round((stats.good / stats.total) * 100) : 0}%)\n`
    reportText += `注意: ${stats.warning} (${stats.total > 0 ? Math.round((stats.warning / stats.total) * 100) : 0}%)\n`
    reportText += `危険: ${stats.danger} (${stats.total > 0 ? Math.round((stats.danger / stats.total) * 100) : 0}%)\n\n`

    completedWorkTypes.forEach((workType) => {
      reportText += `\n【${workType.name}】\n`
      workType.categories.forEach((category) => {
        reportText += `\n${category.name}:\n`
        category.items.forEach((item) => {
          const ratingLabel = item.rating ? ratingConfig[item.rating].label : "未評価"
          reportText += `  - ${item.name}: ${ratingLabel}\n`
          if (item.notes) {
            reportText += `    メモ: ${item.notes}\n`
          }
        })
      })
    })

    if (finalComments) {
      reportText += `\n【総合コメント】\n${finalComments}\n`
    }

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `安全点検報告書_${inspectionData.basicInfo?.date}_${inspectionData.basicInfo?.siteName}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleFinish = () => {
    if (confirm("点検を完了してメニューに戻りますか？")) {
      clearInspectionData()
      router.push("/")
    }
  }

  if (!inspectionData) {
    return null
  }

  const stats = calculateStats()
  const completedWorkTypes = inspectionData.workTypes.filter((wt) => wt.status === "completed")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-card px-4 py-3 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const lastWorkType = completedWorkTypes[completedWorkTypes.length - 1]
            if (lastWorkType) {
              router.push(`/checklist/${lastWorkType.id}`)
            } else {
              router.push("/work-selection")
            }
          }}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">点検結果サマリー</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-md space-y-6">
          {/* Basic Info */}
          <Card className="p-5">
            <h2 className="mb-4 text-base font-bold text-foreground">基本情報</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">点検日:</span>
                <span className="font-medium">{inspectionData.basicInfo?.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">現場名:</span>
                <span className="font-medium">{inspectionData.basicInfo?.siteName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">場所:</span>
                <span className="font-medium">{inspectionData.basicInfo?.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">責任者:</span>
                <span className="font-medium">{inspectionData.basicInfo?.supervisor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">工事種別:</span>
                <span className="font-medium">{inspectionData.basicInfo?.constructionType}</span>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="p-5">
            <h2 className="mb-4 text-base font-bold text-foreground">点検結果統計</h2>
            <div className="mb-4 grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-2xl font-black text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">総項目</div>
              </div>
              <div>
                <div className="text-2xl font-black text-success">{stats.good}</div>
                <div className="text-xs text-muted-foreground">良好</div>
              </div>
              <div>
                <div className="text-2xl font-black text-warning">{stats.warning}</div>
                <div className="text-xs text-muted-foreground">注意</div>
              </div>
              <div>
                <div className="text-2xl font-black text-destructive">{stats.danger}</div>
                <div className="text-xs text-muted-foreground">危険</div>
              </div>
            </div>

            {stats.total > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="flex h-full">
                      <div className="bg-success" style={{ width: `${(stats.good / stats.total) * 100}%` }} />
                      <div className="bg-warning" style={{ width: `${(stats.warning / stats.total) * 100}%` }} />
                      <div className="bg-destructive" style={{ width: `${(stats.danger / stats.total) * 100}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>良好 {Math.round((stats.good / stats.total) * 100)}%</span>
                  <span>注意 {Math.round((stats.warning / stats.total) * 100)}%</span>
                  <span>危険 {Math.round((stats.danger / stats.total) * 100)}%</span>
                </div>
              </div>
            )}
          </Card>

          {/* Work Type Details */}
          {completedWorkTypes.map((workType) => (
            <Card key={workType.id} className="p-5">
              <h2 className="mb-4 text-base font-bold text-foreground">{workType.name}</h2>
              <div className="space-y-4">
                {workType.categories.map((category) => (
                  <div key={category.id}>
                    <h3 className="mb-2 text-sm font-bold text-muted-foreground">{category.name}</h3>
                    <div className="space-y-2">
                      {category.items.map((item) => {
                        const config = item.rating ? ratingConfig[item.rating] : null
                        const Icon = config?.icon

                        return (
                          <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                            <span className="flex-1">{item.name}</span>
                            {config && Icon && (
                              <Badge variant="outline" className={`${config.bgColor} shrink-0`}>
                                <Icon className={`mr-1 h-3 w-3 ${config.color}`} />
                                {config.label}
                              </Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    {category.id !== workType.categories[workType.categories.length - 1].id && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {/* Final Comments */}
          <Card className="p-5">
            <h2 className="mb-3 text-base font-bold text-foreground">総合コメント</h2>
            <Textarea
              placeholder="点検全体の総括や特記事項を入力..."
              value={finalComments}
              onChange={(e) => handleCommentsChange(e.target.value)}
              className="min-h-32 text-base"
            />
          </Card>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card px-4 py-4 shadow-lg">
        <div className="flex gap-3">
          <Button
            onClick={handleExport}
            variant="outline"
            size="lg"
            className="h-14 flex-1 text-base font-bold bg-transparent"
          >
            <Download className="mr-2 h-5 w-5" />
            エクスポート
          </Button>
          <Button onClick={handleFinish} size="lg" className="h-14 flex-1 text-base font-bold">
            <Home className="mr-2 h-5 w-5" />
            完了
          </Button>
        </div>
      </footer>
    </div>
  )
}
