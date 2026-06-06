export interface User {
  id: number
  username: string
  name: string
  avatar?: string
}

export interface HealthRecord {
  id: number
  userId: number
  date: string
  systolic?: number
  diastolic?: number
  bloodSugar?: number
  weight?: number
  bodyFat?: number
  heartRate?: number
  cholesterol?: number
  uricAcid?: number
  notes?: string
  reportImage?: string
  createdAt: string
}

export interface Medication {
  id: number
  userId: number
  name: string
  dosage: string
  frequency: string
  time: string
  startDate: string
  endDate?: string
  notes?: string
  active: boolean
}

export interface FamilyMember {
  id: number
  userId: number
  memberId: number
  memberName: string
  relation: string
  createdAt: string
}

export interface HealthSummary {
  latestRecord?: HealthRecord
  abnormalCount: number
  pendingReview: string[]
}
