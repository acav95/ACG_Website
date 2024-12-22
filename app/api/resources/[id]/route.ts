import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { cookies } from 'next/headers'

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

function isAdmin(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')
  return token?.value === 'admin-secret-token-123'
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await fs.readFile(resourcesPath, 'utf-8')
    const resources = JSON.parse(data)
    const resource = resources.find((r: Resource) => r.id === parseInt(params.id))
    
    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(resource)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await fs.readFile(resourcesPath, 'utf-8')
    const resources = JSON.parse(data)
    const updatedResources = resources.filter((r: Resource) => r.id !== parseInt(params.id))
    await fs.writeFile(resourcesPath, JSON.stringify(updatedResources, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const data = await fs.readFile(resourcesPath, 'utf-8')
    const resources = JSON.parse(data)
    const index = resources.findIndex((r: Resource) => r.id === parseInt(params.id))
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }
    
    resources[index] = {
      ...resources[index],
      ...body,
      id: parseInt(params.id)
    }
    
    await fs.writeFile(resourcesPath, JSON.stringify(resources, null, 2))
    return NextResponse.json(resources[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    )
  }
} 