import { ElectronAPI } from '@electron-toolkit/preload'
import { AppItem } from './app'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      pickApp: () => Promise<Omit<AppItem, 'id'> | null>
      loadApps: () => Promise<AppItem[]>
      addApp: (item: AppItem) => Promise<AppItem[]>
      updateApp: (item: AppItem) => Promise<AppItem[]>
      deleteApp: (id: string) => Promise<AppItem[]>
    }
  }
}

export {}
