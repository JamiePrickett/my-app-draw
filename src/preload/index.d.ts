import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      pickApp: () => Promise<{
        title: string
        source: string
        icon: string | null
      } | null>
    }
  }
}
