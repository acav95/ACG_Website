import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminDb } from '@/lib/firebase/admin'

function isAdmin(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')
  return token?.value === 'admin-secret-token-123'
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await adminDb.collection('resources').doc(params.id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await adminDb.collection('resources').doc(params.id).get()
    
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ id: doc.id, ...doc.data() })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
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
    const docRef = adminDb.collection('resources').doc(params.id)
    
    await docRef.update({
      ...body,
      updatedAt: new Date().toISOString()
    })

    const updatedDoc = await docRef.get()
    return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    )
  }
} 