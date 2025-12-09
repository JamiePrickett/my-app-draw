import { ElectronAPI } from '@electron-toolkit/preload'
import { AppItem, Group } from './app'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      pickApp: () => Promise<Omit<AppItem, 'id'> | null>

      loadApps: () => Promise<AppItem[]>
      addApp: (item: AppItem) => Promise<AppItem[]>
      updateApp: (item: AppItem) => Promise<AppItem[]>
      deleteApp: (id: string) => Promise<AppItem[]>

      launchApp: (source: string) => Promise<boolean>

      loadGroups: () => Promise<Group[]>
      addGroup: (Group: Group) => Promise<Group[]>
      updateGroup: (Group: Group) => Promise<Group[]>
      deleteGroup: (id: string) => Promise<Group[]>
    }
  }
}

export {}
