import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { cookies } from 'next/headers'

interface Thought {
  id: string;
  title: string;
  type: string;
  body: string;
  date: string;
  slug: string;
}

const thoughtsPath = path.join(process.cwd(), 'data', 'thoughts.json')

async function getThoughts() {
  try {
    const data = await fs.readFile(thoughtsPath, 'utf-8')
    return JSON.parse(data) as Thought[]
  } catch (error) {
    console.error('Error reading thoughts:', error)
    return []
  }
}

async function saveThoughts(thoughts: Thought[]): Promise<void> {
  await fs.mkdir(path.dirname(thoughtsPath), { recursive: true })
  await fs.writeFile(thoughtsPath, JSON.stringify(thoughts, null, 2))
}

function isAdmin(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')
  return token?.value === 'admin-secret-token-123'
}

export async function GET() {
  try {
    const thoughts = await getThoughts()
    return NextResponse.json(thoughts)
  } catch (err) {
    console.error('Error in GET /api/thoughts:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const thoughts = await getThoughts()
    
    const newThought = {
      id: String(thoughts.length + 1),
      title: body.title.trim(),
      type: body.type,
      body: body.body,
      date: new Date().toISOString().split('T')[0],
      slug: body.title.trim().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    thoughts.push(newThought)
    await saveThoughts(thoughts)
    
    return NextResponse.json(newThought, { status: 201 })
  } catch (error) {
    console.error('Error creating thought:', error)
    return NextResponse.json(
      { error: 'Failed to create thought' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... existing DELETE logic ...
}

export async function PUT(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... existing PUT logic ...
} 