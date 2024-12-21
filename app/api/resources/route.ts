import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminDb } from '@/lib/firebase/admin'

function isAdmin(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')
  return token?.value === 'admin-secret-token-123'
}

export async function GET() {
  try {
    const snapshot = await adminDb.collection('resources').orderBy('date', 'desc').get()
    const resources = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error in GET /api/resources:', error)
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
    const body = await request.json()
    
    const newResource = {
      ...body,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }

    const docRef = await adminDb.collection('resources').add(newResource)
    
    return NextResponse.json({ 
      id: docRef.id,
      ...newResource 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating resource:', error)
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
    
    await adminDb.collection('resources').doc(resourceId).delete()
    return NextResponse.json({ message: 'Resource deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
} 