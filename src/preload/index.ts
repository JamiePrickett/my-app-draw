import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { AppItem } from '../shared/types'
import { Group } from '../shared/types/app'

// Custom APIs for renderer
const api = {
  pickApp: () => ipcRenderer.invoke('pick-app'),

  // app CRUD
  loadApps: () => ipcRenderer.invoke('apps:load'),
  addApp: (item: AppItem) => ipcRenderer.invoke('apps:add', item),
  updateApp: (item: AppItem) => ipcRenderer.invoke('apps:update', item),
  deleteApp: (id: string) => ipcRenderer.invoke('apps:delete', id),

  launchApp: (source: string) => ipcRenderer.invoke('apps:launch', source),

  loadGroups: () => ipcRenderer.invoke('groups:load'),
  addGroup: (Group: Group) => ipcRenderer.invoke('groups:add', Group),
  updateGroup: (Group: Group) => ipcRenderer.invoke('groups:update', Group),
  deleteGroup: (id: string) => ipcRenderer.invoke('groups:delete', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('failed to expose preload:', error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
