'use client'

import Link from 'next/link'
import { useAdmin } from '@/contexts/AdminContext'

export default function Header() {
  const { isAdmin } = useAdmin()

  return (
    <header className="flex justify-between items-center">
      <Link href="/" className="text-l font-bold">
        ACG
      </Link>
      <nav className="flex gap-8 text-gray-400">
        <Link 
          href="/thoughts" 
          className="text-l hover:text-gray-200 transition-colors"
        >
          Thoughts
        </Link>
        <Link 
          href="/resources" 
          className="text-l hover:text-gray-200 transition-colors"
        >
          Resources
        </Link>
        {isAdmin && (
          <Link 
            href="/admin/dashboard" 
            className="text-l text-primary hover:text-primary/80 transition-colors"
          >
            Admin
          </Link>
        )}
      </nav>
    </header>
  )
} 