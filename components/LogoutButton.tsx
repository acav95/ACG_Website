'use client'

import { useAdmin } from '@/contexts/AdminContext'
import Cookies from 'js-cookie'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const { isAdmin, setIsAdmin } = useAdmin()

  if (!isAdmin) return null

  const handleLogout = () => {
    Cookies.remove('admin-token')
    setIsAdmin(false)
    window.location.href = '/' // Redirect to home page
  }

  return (
    <button
      onClick={handleLogout}
      className="fixed bottom-4 left-4 bg-red-500/90 hover:bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
      title="Logout"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  )
} 