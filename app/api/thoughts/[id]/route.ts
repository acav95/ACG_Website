import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { cookies } from 'next/headers'

const thoughtsPath = path.join(process.cwd(), 'data', 'thoughts.json')

interface Thought {
  id: string
  title: string
  type: string
  body: string
  date: string
  slug: string
}

async function getThoughts(): Promise<Thought[]> {
  const data = await fs.readFile(thoughtsPath, 'utf-8')
  return JSON.parse(data)
}

async function saveThoughts(thoughts: Thought[]) {
  await fs.writeFile(thoughtsPath, JSON.stringify(thoughts, null, 2))
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const thoughts = await getThoughts()
    const thought = thoughts.find(t => t.slug === params.id)
    
    if (!thought) {
      return NextResponse.json(
        { error: 'Thought not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(thought)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch thought' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')
  if (token?.value !== 'admin-secret-token-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const thoughts = await getThoughts()
    const index = thoughts.findIndex(t => t.slug === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Thought not found' },
        { status: 404 }
      )
    }
    
    thoughts[index] = {
      ...thoughts[index],
      ...body,
      id: thoughts[index].id, // Preserve the original ID
      slug: body.title.trim().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    await saveThoughts(thoughts)
    return NextResponse.json(thoughts[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update thought' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')
  if (token?.value !== 'admin-secret-token-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const thoughts = await getThoughts()
    const updatedThoughts = thoughts.filter(t => t.id !== params.id)
    await saveThoughts(updatedThoughts)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete thought' },
      { status: 500 }
    )
  }
} 