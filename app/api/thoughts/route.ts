import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { cookies } from 'next/headers'
import { ensureDataDirectory } from '@/lib/storage'

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
  try {
    const data = await fs.readFile(thoughtsPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading thoughts:', error)
    return []
  }
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
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch thoughts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')
    if (token?.value !== 'admin-secret-token-123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure data directory exists
    ensureDataDirectory()

    const body = await request.json()
    let thoughts = []
    
    try {
      const data = await fs.readFile(thoughtsPath, 'utf-8')
      thoughts = JSON.parse(data)
    } catch (error) {
      // If file doesn't exist, start with empty array
      thoughts = []
    }

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
    await fs.writeFile(thoughtsPath, JSON.stringify(thoughts, null, 2))

    return NextResponse.json(newThought, { status: 201 })
  } catch (error) {
    console.error('Error creating thought:', error)
    return NextResponse.json({ error: 'Failed to create thought' }, { status: 500 })
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