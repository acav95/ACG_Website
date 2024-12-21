'use client'

import { useAdmin } from '@/contexts/AdminContext'
import { Shield } from 'lucide-react'
import Link from 'next/link'

export default function AdminBadge() {
  const { isAdmin } = useAdmin()

  if (!isAdmin) return null

  return (
    <Link 
      href="/admin/dashboard"
      className="fixed bottom-4 right-4 bg-primary/90 hover:bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
    >
      <Shield className="w-4 h-4" />
      Admin Dashboard
    </Link>
  )
} 