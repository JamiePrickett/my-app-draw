import fs from 'fs'
import path from 'path'

const STEAM_LIB_CACHE = path.join('C:', 'Program Files (x86)', 'Steam', 'appcache', 'librarycache')

export function getSteamIcon(url: string): string | null {
  const match = url.match(/steam:\/\/rungameid\/(\d+)/)
  if (!match) return null

  const AppId = match[1]

  const iconPath = path.join(STEAM_LIB_CACHE, AppId)

  if (!fs.existsSync(iconPath)) return null

  const files = fs.readdirSync(iconPath)

  const iconFile = files.find((f) => f.endsWith('.jpg') || f.endsWith('.png'))
  if (!iconFile) return null

  const buffer = fs.readFileSync(path.join(iconPath, iconFile))
  return `data:image/png;base64,${buffer.toString('base64')}`
}
