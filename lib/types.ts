export type InspectionStatus = "not-started" | "in-progress" | "completed"

export type SafetyRating = "good" | "warning" | "danger"

export interface Photo {
  id: string
  url: string
  timestamp: Date
}

export interface BasicInfo {
  date: string
  siteName: string
  location: string
  latitude?: string // Added GPS coordinates
  longitude?: string // Added GPS coordinates
  siteRepresentative: string // Changed from supervisor
  siteSupervisor: string // Added site supervisor field
  teamMembers: string[]
  constructionType: string
}

export interface ChecklistItem {
  id: string
  name: string
  rating: SafetyRating | null
  notes: string
  tips: {
    text: string
    image?: string
  }
}

export interface ChecklistCategory {
  id: string
  name: string
  items: ChecklistItem[]
  photos: Photo[] // Photos are now at category level
  findings?: string // Added findings field for remarks when issues are found
}

export interface WorkType {
  id: string
  name: string
  status: InspectionStatus
  categories: ChecklistCategory[]
}

export interface InspectionData {
  basicInfo: BasicInfo | null
  workTypes: WorkType[]
  finalComments: string
}
