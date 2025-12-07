import fs from 'fs'
import os from 'os'
import path from 'path'
import { dialog, ipcMain } from 'electron'
import { extractUrlFromShortcut } from '../services/shortcuts'
import { getSteamIcon } from '../services/steam'
import { getFileIconBase64 } from '../utils/icon'

ipcMain.handle('pick-app', async () => {
  const userDir = os.homedir()
  const defaultPath = path.join('C:', 'Program Files')
  const defaultPathX86 = path.join('C:', 'Program Files (x86)')

  const result = await dialog.showOpenDialog({
    title: 'Select an application',
    defaultPath: fs.existsSync(defaultPath)
      ? defaultPath
      : fs.existsSync(defaultPathX86)
        ? defaultPathX86
        : userDir,

    properties: ['openFile'],
    filters: [{ name: 'Applications', extensions: ['exe', 'app', 'url'] }]
  })

  if (result.canceled) return null

  const filePath = result.filePaths[0]
  const ext = path.extname(filePath).toLowerCase()
  const title = path.basename(filePath, ext)

  // URL (web links)
  if (ext === '.url') {
    const url = extractUrlFromShortcut(filePath)
    if (!url) return null

    const steamIcon = getSteamIcon(url)

    return {
      title,
      source: url,
      icon: steamIcon
    }
  }

  const icon = await getFileIconBase64(filePath)

  return {
    title,
    source: filePath,
    icon
  }
})
