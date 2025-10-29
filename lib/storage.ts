"use client"

import type { InspectionData } from "./types"

const STORAGE_KEY = "construction-inspection-data"

export function saveInspectionData(data: InspectionData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

export function loadInspectionData(): InspectionData | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  }
  return null
}

export function clearInspectionData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}
