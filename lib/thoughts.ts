import fs from 'fs/promises'
import path from 'path'

export interface Thought {
  id: string
  title: string
  type: string
  body: string
  date: string
  slug: string
}

export async function getThoughts(): Promise<Thought[]> {
  const thoughtsPath = path.join(process.cwd(), 'data', 'thoughts.json')
  const data = await fs.readFile(thoughtsPath, 'utf-8')
  return JSON.parse(data)
} 