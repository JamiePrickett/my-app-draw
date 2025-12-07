import { app } from 'electron'

export async function getFileIconBase64(filePath: string) {
  try {
    const icon = await app.getFileIcon(filePath, { size: 'large' })
    return icon.toDataURL()
  } catch (error) {
    console.log(error)
    return null
  }
}
