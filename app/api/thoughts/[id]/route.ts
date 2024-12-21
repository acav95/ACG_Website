import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const thoughtsPath = path.join(process.cwd(), 'data', 'thoughts.json')

interface Thought {
  id: string
  title: string
  type: string
  body: string
  date: string
  slug: string
}

async function getThoughts() {
  const data = await fs.readFile(thoughtsPath, 'utf-8')
  return JSON.parse(data) as Thought[]
}

async function saveThoughts(thoughts: Thought[]) {
  await fs.writeFile(thoughtsPath, JSON.stringify(thoughts, null, 2))
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const thoughts = await getThoughts()
    const updatedThoughts = thoughts.filter((t: Thought) => t.id !== params.id)
    await saveThoughts(updatedThoughts)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete thought' },
      { status: 500 }
    )
  }
} 