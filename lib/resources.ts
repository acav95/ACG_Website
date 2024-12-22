import fs from 'fs/promises'
import path from 'path'

export interface Resource {
  id: number
  title: string
  author: string
  date: string
  rating: number
  type: string
  comment?: string
  fileUrl?: string
}

export async function getResources(): Promise<Resource[]> {
  try {
    const resourcesPath = path.join(process.cwd(), 'data', 'resources.json')
    const data = await fs.readFile(resourcesPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading resources:', error)
    return []
  }
} 