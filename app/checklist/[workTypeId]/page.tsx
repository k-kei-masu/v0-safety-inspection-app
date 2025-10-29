"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  X,
  ZoomIn,
} from "lucide-react"
import { loadInspectionData, saveInspectionData } from "@/lib/storage"
import type { InspectionData, WorkType, SafetyRating } from "@/lib/types"

const ratingConfig = {
  good: {
    label: "良好",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success",
  },
  warning: {
    label: "注意",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning",
  },
  danger: {
    label: "危険",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive",
  },
}

export default function ChecklistPage({ params }: { params: { workTypeId: string } }) {
  const { workTypeId } = params
  const router = useRouter()
  const [inspectionData, setInspectionData] = useState<InspectionData | null>(null)
  const [currentWorkType, setCurrentWorkType] = useState<WorkType | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [previewPhoto, setPreviewPhoto] = useState<{ open: boolean; url: string; categoryId: string; index: number }>({
    open: false,
    url: "",
    categoryId: "",
    index: -1,
  })
  const [tipsDialog, setTipsDialog] = useState<{ open: boolean; title: string; content: string; image?: string }>({
    open: false,
    title: "",
    content: "",
    image: undefined,
  })
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  useEffect(() => {
    const data = loadInspectionData()
    if (!data?.basicInfo) {
      router.push("/basic-info")
      return
    }

    const workType = data.workTypes.find((wt) => wt.id === workTypeId)
    if (!workType) {
      router.push("/work-selection")
      return
    }

    setInspectionData(data)
    setCurrentWorkType(workType)
  }, [workTypeId, router])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handlePhotoCapture = (categoryId: string) => {
    fileInputRefs.current[categoryId]?.click()
  }

  const handleFileSelect = async (categoryId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !inspectionData || !currentWorkType) return

    const newPhotos: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()

      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          if (reader.result) {
            newPhotos.push(reader.result as string)
          }
          resolve()
        }
        reader.readAsDataURL(file)
      })
    }

    const updatedWorkTypes = inspectionData.workTypes.map((wt) => {
      if (wt.id === workTypeId) {
        return {
          ...wt,
          categories: wt.categories.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                photos: [...(cat.photos || []), ...newPhotos],
              }
            }
            return cat
          }),
        }
      }
      return wt
    })

    const updatedData = { ...inspectionData, workTypes: updatedWorkTypes }
    setInspectionData(updatedData)
    setCurrentWorkType(updatedWorkTypes.find((wt) => wt.id === workTypeId) || null)
    saveInspectionData(updatedData)

    if (fileInputRefs.current[categoryId]) {
      fileInputRefs.current[categoryId]!.value = ""
    }
  }

  const deletePhoto = (categoryId: string, photoIndex: number) => {
    if (!inspectionData || !currentWorkType) return

    const updatedWorkTypes = inspectionData.workTypes.map((wt) => {
      if (wt.id === workTypeId) {
        return {
          ...wt,
          categories: wt.categories.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                photos: cat.photos?.filter((_, index) => index !== photoIndex) || [],
              }
            }
            return cat
          }),
        }
      }
      return wt
    })

    const updatedData = { ...inspectionData, workTypes: updatedWorkTypes }
    setInspectionData(updatedData)
    setCurrentWorkType(updatedWorkTypes.find((wt) => wt.id === workTypeId) || null)
    saveInspectionData(updatedData)

    if (previewPhoto.open && previewPhoto.categoryId === categoryId && previewPhoto.index === photoIndex) {
      setPreviewPhoto({ open: false, url: "", categoryId: "", index: -1 })
    }
  }

  const openPhotoPreview = (categoryId: string, photoUrl: string, index: number) => {
    setPreviewPhoto({ open: true, url: photoUrl, categoryId, index })
  }

  const updateRating = (categoryId: string, itemId: string, rating: SafetyRating) => {
    if (!inspectionData || !currentWorkType) return

    const updatedWorkTypes = inspectionData.workTypes.map((wt) => {
      if (wt.id === workTypeId) {
        return {
          ...wt,
          categories: wt.categories.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                items: cat.items.map((item) => {
                  if (item.id === itemId) {
                    return { ...item, rating }
                  }
                  return item
                }),
              }
            }
            return cat
          }),
        }
      }
      return wt
    })

    const updatedData = { ...inspectionData, workTypes: updatedWorkTypes }
    setInspectionData(updatedData)
    setCurrentWorkType(updatedWorkTypes.find((wt) => wt.id === workTypeId) || null)
    saveInspectionData(updatedData)
  }

  const updateNotes = (categoryId: string, itemId: string, notes: string) => {
    if (!inspectionData || !currentWorkType) return

    const updatedWorkTypes = inspectionData.workTypes.map((wt) => {
      if (wt.id === workTypeId) {
        return {
          ...wt,
          categories: wt.categories.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                items: cat.items.map((item) => {
                  if (item.id === itemId) {
                    return { ...item, notes }
                  }
                  return item
                }),
              }
            }
            return cat
          }),
        }
      }
      return wt
    })

    const updatedData = { ...inspectionData, workTypes: updatedWorkTypes }
    setInspectionData(updatedData)
    setCurrentWorkType(updatedWorkTypes.find((wt) => wt.id === workTypeId) || null)
    saveInspectionData(updatedData)
  }

  const calculateProgress = () => {
    if (!currentWorkType) return 0
    const totalItems = currentWorkType.categories.reduce((sum, cat) => sum + cat.items.length, 0)
    const ratedItems = currentWorkType.categories.reduce(
      (sum, cat) => sum + cat.items.filter((item) => item.rating !== null).length,
      0,
    )
    return totalItems > 0 ? (ratedItems / totalItems) * 100 : 0
  }

  const handleNext = () => {
    if (!inspectionData || !currentWorkType) return

    const updatedWorkTypes = inspectionData.workTypes.map((wt) => {
      if (wt.id === workTypeId) {
        return { ...wt, status: "completed" as const }
      }
      return wt
    })

    const updatedData = { ...inspectionData, workTypes: updatedWorkTypes }
    saveInspectionData(updatedData)

    router.push("/work-selection")
  }

  const showTips = (itemName: string, tips: { text: string; image?: string }) => {
    setTipsDialog({
      open: true,
      title: itemName,
      content: tips.text,
      image: tips.image,
    })
  }

  const updateFindings = (categoryId: string, findings: string) => {
    if (!inspectionData || !currentWorkType) return

    const updatedWorkTypes = inspectionData.workTypes.map((wt) => {
      if (wt.id === workTypeId) {
        return {
          ...wt,
          categories: wt.categories.map((cat) => {
            if (cat.id === categoryId) {
              return { ...cat, findings }
            }
            return cat
          }),
        }
      }
      return wt
    })

    const updatedData = { ...inspectionData, workTypes: updatedWorkTypes }
    setInspectionData(updatedData)
    setCurrentWorkType(updatedWorkTypes.find((wt) => wt.id === workTypeId) || null)
    saveInspectionData(updatedData)
  }

  const hasIssues = (categoryId: string) => {
    if (!currentWorkType) return false
    const category = currentWorkType.categories.find((cat) => cat.id === categoryId)
    if (!category) return false
    return category.items.some((item) => item.rating === "warning" || item.rating === "danger")
  }

  if (!workTypeId || !inspectionData || !currentWorkType) {
    return null
  }

  const progress = calculateProgress()
  const isComplete = progress === 100

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-card shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/work-selection")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{currentWorkType.name}</h1>
            <p className="text-xs text-muted-foreground">安全点検チェックリスト</p>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3">
            <Progress value={progress} className="h-2 flex-1" />
            <span className="text-sm font-bold text-foreground">{Math.round(progress)}%</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-md space-y-6">
          {currentWorkType.categories.map((category) => {
            const categoryHasIssues = hasIssues(category.id)

            return (
              <div key={category.id} className="space-y-3">
                <h2 className="text-lg font-bold text-foreground">{category.name}</h2>

                <div className="overflow-hidden rounded-lg border bg-card">
                  <div className="bg-primary/5 px-4 py-3">
                    <h3 className="text-sm font-bold text-foreground">写真撮影</h3>
                  </div>
                  <div className="space-y-3 px-4 py-4">
                    <input
                      ref={(el) => (fileInputRefs.current[category.id] = el)}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={(e) => handleFileSelect(category.id, e)}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handlePhotoCapture(category.id)}
                      className="h-12 w-full"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      写真を撮る ({category.photos?.length || 0}枚)
                    </Button>

                    {category.photos && category.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {category.photos.map((photo, index) => (
                          <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border">
                            <img
                              src={photo || "/placeholder.svg"}
                              alt={`写真 ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                onClick={() => openPhotoPreview(category.id, photo, index)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 hover:bg-white"
                              >
                                <ZoomIn className="h-4 w-4 text-foreground" />
                              </button>
                              <button
                                onClick={() => deletePhoto(category.id, index)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/90 hover:bg-destructive"
                              >
                                <X className="h-4 w-4 text-destructive-foreground" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border bg-card">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-3 py-2 text-left text-sm font-bold text-foreground">点検項目</th>
                          <th className="px-3 py-2 text-center text-sm font-bold text-foreground">評価</th>
                          <th className="w-12 px-2 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.items.map((item, index) => {
                          const isExpanded = expandedItems.has(item.id)
                          const hasRating = item.rating !== null

                          return (
                            <>
                              <tr
                                key={item.id}
                                className={`border-b last:border-b-0 ${hasRating ? "bg-primary/5" : ""}`}
                              >
                                <td className="px-3 py-3">
                                  <div className="flex items-start gap-2">
                                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                                    <button
                                      onClick={() => showTips(item.name, item.tips)}
                                      className="shrink-0 text-primary hover:text-primary/80"
                                      aria-label="Tips"
                                    >
                                      <Lightbulb className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>

                                <td className="px-3 py-3">
                                  <div className="flex justify-center gap-1">
                                    {(Object.keys(ratingConfig) as SafetyRating[]).map((rating) => {
                                      const config = ratingConfig[rating]
                                      const Icon = config.icon
                                      const isSelected = item.rating === rating

                                      return (
                                        <button
                                          key={rating}
                                          onClick={() => updateRating(category.id, item.id, rating)}
                                          className={`flex h-10 w-10 items-center justify-center rounded-md border transition-colors ${
                                            isSelected
                                              ? `${config.bgColor} ${config.borderColor} border-2`
                                              : "border-border hover:bg-muted"
                                          }`}
                                          aria-label={config.label}
                                        >
                                          <Icon
                                            className={`h-5 w-5 ${isSelected ? config.color : "text-muted-foreground"}`}
                                          />
                                        </button>
                                      )
                                    })}
                                  </div>
                                </td>

                                <td className="px-2 py-3">
                                  <button
                                    onClick={() => toggleExpanded(item.id)}
                                    className="flex h-8 w-8 items-center justify-center rounded hover:bg-muted"
                                    aria-label="詳細"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </button>
                                </td>
                              </tr>

                              {isExpanded && (
                                <tr key={`${item.id}-expanded`}>
                                  <td colSpan={3} className="border-b bg-muted/30 px-3 py-3 last:border-b-0">
                                    <div className="space-y-3">
                                      <div>
                                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                          メモ
                                        </label>
                                        <Textarea
                                          placeholder="メモを入力..."
                                          value={item.notes}
                                          onChange={(e) => updateNotes(category.id, item.id, e.target.value)}
                                          className="min-h-20 text-sm"
                                        />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {categoryHasIssues && (
                  <div className="overflow-hidden rounded-lg border border-warning bg-warning/5">
                    <div className="bg-warning/10 px-4 py-3">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        気づき・指摘内容
                      </h3>
                    </div>
                    <div className="px-4 py-4">
                      <Textarea
                        placeholder="問題点や改善が必要な内容を記入してください..."
                        value={category.findings || ""}
                        onChange={(e) => updateFindings(category.id, e.target.value)}
                        className="min-h-32 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card px-4 py-4 shadow-lg">
        <Button onClick={handleNext} disabled={!isComplete} size="lg" className="h-14 w-full text-base font-bold">
          {isComplete ? "次へ進む" : "すべての項目を評価してください"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </footer>

      <Dialog open={previewPhoto.open} onOpenChange={(open) => setPreviewPhoto({ ...previewPhoto, open })}>
        <DialogContent className="mx-4 max-w-md">
          <DialogHeader>
            <DialogTitle>写真プレビュー</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg">
              <img src={previewPhoto.url || "/placeholder.svg"} alt="プレビュー" className="h-auto w-full" />
            </div>
            <Button
              variant="destructive"
              onClick={() => {
                deletePhoto(previewPhoto.categoryId, previewPhoto.index)
                setPreviewPhoto({ open: false, url: "", categoryId: "", index: -1 })
              }}
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              この写真を削除
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={tipsDialog.open} onOpenChange={(open) => setTipsDialog({ ...tipsDialog, open })}>
        <DialogContent className="mx-4 max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-primary" />
              {tipsDialog.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {tipsDialog.image && (
              <div className="overflow-hidden rounded-lg border">
                <img
                  src={tipsDialog.image || "/placeholder.svg"}
                  alt={tipsDialog.title}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
            <DialogDescription className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {tipsDialog.content}
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
