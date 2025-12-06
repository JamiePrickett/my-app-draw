import fs from 'fs'
import { app, shell, BrowserWindow, ipcMain, dialog, net } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle('pick-app', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Applications', extensions: ['exe', 'app', 'url'] }]
  })

  if (result.canceled) return null
  const filePath = result.filePaths[0]
  const ext = path.extname(filePath).toLowerCase()
  const title = path.basename(filePath, ext)
  let source = filePath
  let iconBase64: string | null = null

  // Executable / app files
  if (ext !== '.url') {
    try {
      const icon = await app.getFileIcon(filePath, { size: 'large' })
      iconBase64 = icon.toDataURL()
    } catch (error) {
      console.warn('Icon extraction failed:', error)
    }
    return { title, source, icon: iconBase64 }
  }

  // Handle .url files
  const contents = fs.readFileSync(filePath, 'utf-8')
  const urlMatch = contents.match(/URL=(.+)/)
  if (!urlMatch) return null
  const url = urlMatch[1].trim()
  source = url

  // Check for Steam URL
  const steamMatch = url.match(/steam:\/\/rungameid\/(\d+)/)
  if (steamMatch) {
    const appId = steamMatch[1]

    // Check Steam librarycache folder
    const steamLibraryCache = path.join(
      'C:',
      'Program Files (x86)',
      'Steam',
      'appcache',
      'librarycache',
      appId
    )

    if (fs.existsSync(steamLibraryCache)) {
      const files = fs.readdirSync(steamLibraryCache)
      // Look for a typical library image
      const imageFile = files.find((f) => f.endsWith('.jpg') || f.endsWith('.png'))
      if (imageFile) {
        const buffer = fs.readFileSync(path.join(steamLibraryCache, imageFile))
        iconBase64 = `data:image/png;base64,${buffer.toString('base64')}`
      }
    }

    return { title, source, icon: iconBase64 }
  }

  // Generic URL fallback (favicon)
  try {
    const faviconUrl = new URL('/favicon.ico', url).href
    iconBase64 = await downloadImageToBase64(faviconUrl)
  } catch (e) {
    console.warn('Favicon fetch failed:', e)
  }

  return { title, source, icon: iconBase64 }
})

async function downloadImageToBase64(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const request = net.request(url)
    request.on('response', (response) => {
      const chunks: Buffer[] = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve(`data:image/png;base64,${buffer.toString('base64')}`)
      })
    })
    request.on('error', () => resolve(null))
    request.end()
  })
}
