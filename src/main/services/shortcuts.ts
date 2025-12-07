import fs from 'fs'

export function extractUrlFromShortcut(filePath: string): string | null {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const match = raw.match(/URL=(.+)/)
  return match?.[1].trim() || null
}
