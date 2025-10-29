"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Plus, X, MapPin } from "lucide-react"
import { loadInspectionData, saveInspectionData } from "@/lib/storage"
import { defaultWorkTypes } from "@/lib/inspection-data"
import type { BasicInfo, InspectionData } from "@/lib/types"

export default function BasicInfoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<BasicInfo>({
    date: new Date().toISOString().split("T")[0],
    siteName: "",
    location: "",
    latitude: "",
    longitude: "",
    siteRepresentative: "",
    siteSupervisor: "",
    teamMembers: [],
    constructionType: "",
  })
  const [newMember, setNewMember] = useState("")
  const [gpsLoading, setGpsLoading] = useState(false)

  useEffect(() => {
    const data = loadInspectionData()
    if (data?.basicInfo) {
      setFormData(data.basicInfo)
    }
  }, [])

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      alert("お使いのブラウザは位置情報に対応していません")
      return
    }

    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }))
        setGpsLoading(false)
      },
      (error) => {
        alert("位置情報の取得に失敗しました: " + error.message)
        setGpsLoading(false)
      },
    )
  }

  const handleAddMember = () => {
    if (newMember.trim()) {
      setFormData((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newMember.trim()],
      }))
      setNewMember("")
    }
  }

  const handleRemoveMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }))
  }

  const handleNext = () => {
    const existingData = loadInspectionData()
    const inspectionData: InspectionData = {
      basicInfo: formData,
      workTypes: existingData?.workTypes || defaultWorkTypes,
      finalComments: existingData?.finalComments || "",
    }
    saveInspectionData(inspectionData)
    router.push("/work-selection")
  }

  const isFormValid =
    formData.siteName.trim() &&
    formData.location.trim() &&
    formData.siteRepresentative.trim() &&
    formData.siteSupervisor.trim() &&
    formData.constructionType.trim() &&
    formData.teamMembers.length > 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-card px-4 py-3 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">基本情報入力</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-md space-y-6">
          <Card className="p-5">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-foreground">
                  パトロール日
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-sm font-medium text-foreground">
                  現場名 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="siteName"
                  placeholder="例: 〇〇ビル建設工事"
                  value={formData.siteName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, siteName: e.target.value }))}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-foreground">
                  場所 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="例: 東京都渋谷区〇〇"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">GPS座標</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="緯度"
                    value={formData.latitude}
                    onChange={(e) => setFormData((prev) => ({ ...prev, latitude: e.target.value }))}
                    className="h-12 flex-1 text-base"
                  />
                  <Input
                    placeholder="経度"
                    value={formData.longitude}
                    onChange={(e) => setFormData((prev) => ({ ...prev, longitude: e.target.value }))}
                    className="h-12 flex-1 text-base"
                  />
                  <Button
                    onClick={handleGetGPS}
                    disabled={gpsLoading}
                    size="icon"
                    className="h-12 w-12 shrink-0"
                    type="button"
                  >
                    <MapPin className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteRepresentative" className="text-sm font-medium text-foreground">
                  現場代理人 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="siteRepresentative"
                  placeholder="例: 山田太郎"
                  value={formData.siteRepresentative}
                  onChange={(e) => setFormData((prev) => ({ ...prev, siteRepresentative: e.target.value }))}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteSupervisor" className="text-sm font-medium text-foreground">
                  現場監督 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="siteSupervisor"
                  placeholder="例: 佐藤次郎"
                  value={formData.siteSupervisor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, siteSupervisor: e.target.value }))}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="constructionType" className="text-sm font-medium text-foreground">
                  工事種別 <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.constructionType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, constructionType: value }))}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="工事種別を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical-kyuden">電気（九電）</SelectItem>
                    <SelectItem value="civil-kyuden">土木（九電）</SelectItem>
                    <SelectItem value="electrical-general">電気（一般）</SelectItem>
                    <SelectItem value="civil-general">土木（一般）</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  作業員 <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="作業員名を入力"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddMember()
                      }
                    }}
                    className="h-12 flex-1 text-base"
                  />
                  <Button onClick={handleAddMember} size="icon" className="h-12 w-12 shrink-0">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                {formData.teamMembers.length > 0 && (
                  <div className="space-y-2">
                    {formData.teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-3"
                      >
                        <span className="text-sm font-medium">{member}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card px-4 py-4 shadow-lg">
        <Button onClick={handleNext} disabled={!isFormValid} size="lg" className="h-14 w-full text-base font-bold">
          次へ
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </footer>
    </div>
  )
}
