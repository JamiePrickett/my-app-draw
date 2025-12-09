import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { AppItem } from '../../shared/types'
import { Group } from '../../shared/types/app'

const dataDir = app.getPath('userData')
const appsPath = path.join(dataDir, 'apps.json')
const groupsPath = path.join(dataDir, 'groups.json')

function readFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (error) {
    console.error(error)
    return fallback
  }
}

function writeFile<T>(filePath: string, data: T) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export function loadApps(): AppItem[] {
  return readFile<AppItem[]>(appsPath, [])
}

export function saveApps(apps: AppItem[]) {
  writeFile(appsPath, apps)
}

export function loadGroups(): Group[] {
  return readFile<Group[]>(groupsPath, [{ id: 'all', title: 'All', icon: 'grid' }])
}

export function saveGroups(groups: Group[]) {
  writeFile(groupsPath, groups)
}
