import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { cookies } from 'next/headers'
import { ensureDataDirectory } from '@/lib/storage'

const resourcesPath = path.join(process.cwd(), 'data', 'resources.json')

interface Resource {
  id: number
  title: string
  author: string
  date: string
  rating: number
  type: string
  comment?: string
  fileUrl?: string
}

async function getResources() {
  try {
    const data = await fs.readFile(resourcesPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading resources:', error)
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
    const resources = await getResources()
    return NextResponse.json(resources)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    ensureDataDirectory()
    const body = await request.json()
    const resources = await getResources()
    
    const newResource = {
      id: resources.length + 1,
      ...body,
      date: new Date().toISOString().split('T')[0]
    }
    
    resources.push(newResource)
    await fs.writeFile(resourcesPath, JSON.stringify(resources, null, 2))
    
    return NextResponse.json(newResource, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const resourceId = body.id
    
    const resources = await getResources()
    const updatedResources = resources.filter((resource: Resource) => resource.id !== resourceId)
    
    await fs.writeFile(resourcesPath, JSON.stringify(updatedResources, null, 2))
    return NextResponse.json({ message: 'Resource deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
} 