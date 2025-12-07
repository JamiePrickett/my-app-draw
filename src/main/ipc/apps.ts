import { ipcMain } from 'electron'
import { loadApps, saveApps } from '../storage/apps'
import { AppItem } from '../../shared/types'

ipcMain.handle('apps:load', () => {
  return loadApps()
})

ipcMain.handle('apps:add', (_e, item: AppItem) => {
  const apps = loadApps()
  apps.push(item)
  saveApps(apps)
  return apps
})

ipcMain.handle('apps:update', (_e, updatedItem: AppItem) => {
  const apps = loadApps()

  const index = apps.findIndex((a) => a.id === updatedItem.id)

  if (index === -1) {
    console.error('Update app not found')
    throw new Error('App not found')
  }

  apps[index] = updatedItem

  saveApps(apps)
  return apps
})

ipcMain.handle('apps:delete', (_e, id: string) => {
  const apps = loadApps().filter((a) => a.id != id)
  saveApps(apps)
  return apps
})
