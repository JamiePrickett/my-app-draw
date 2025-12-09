import { ipcMain, shell } from 'electron'
import { loadApps, loadGroups, saveApps, saveGroups } from '../storage/apps'
import { AppItem } from '../../shared/types'
import { existsSync } from 'fs'
import { exec } from 'child_process'
import { Group } from '../../shared/types/app'

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

ipcMain.handle('apps:launch', async (_e, source: string) => {
  try {
    if (!source) return false

    if (source.startsWith('http')) {
      await shell.openExternal(source)
      return true
    } else if (existsSync(source)) {
      exec(`"${source}"`, (err) => {
        if (err) console.error('Failed to launch non http app:', err)
      })
      return true
    } else {
      console.error('Source not exist:', source)
      return false
    }
  } catch (error) {
    console.error('Error launching app:', error)
    return false
  }
})

// Groups
ipcMain.handle('groups:load', () => {
  return loadGroups()
})

ipcMain.handle('groups:add', (_, group: Group) => {
  const groups = loadGroups()
  groups.push(group)
  saveGroups(groups)
  return groups
})

ipcMain.handle('groups:update', (_, updatedGroup: Group) => {
  const groups = loadGroups()
  const index = groups.findIndex((c) => c.id === updatedGroup.id)

  if (index === -1) {
    console.error('Update group not found')
    throw new Error('Group not found')
  }

  groups[index] = updatedGroup

  saveGroups(groups)
  return groups
})

ipcMain.handle('groups:delete', (_, id: string) => {
  const groups = loadGroups().filter((c) => c.id !== id)
  saveGroups(groups)
  return groups
})
