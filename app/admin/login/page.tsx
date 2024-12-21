'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Hardcoded for development - in production use proper auth
      if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        // Set cookie for 24 hours
        Cookies.set('admin-token', 'admin-secret-token-123', { 
          expires: 1,
          secure: process.env.NODE_ENV === 'production'
        })
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        setError('Invalid password')
      }
    } catch (error) {
      setError('Login failed')
      console.error('Login error:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 space-y-8">
      <h1 className="text-3xl font-bold text-center">Admin Login</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Login
        </button>
      </form>
    </div>
  )
} 