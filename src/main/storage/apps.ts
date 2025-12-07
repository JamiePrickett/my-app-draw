import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { AppItem } from '../../shared/types'

const filePath = path.join(app.getPath('userData'), 'apps.json')

export function loadApps(): AppItem[] {
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function saveApps(apps: AppItem[]) {
  fs.writeFileSync(filePath, JSON.stringify(apps, null, 2))
}
