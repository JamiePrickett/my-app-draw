import { AppItem } from '@renderer/types/app'

const STORAGE_KEY = 'app-draw-apps'

export function loadApps(): AppItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveApps(apps: AppItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
}
