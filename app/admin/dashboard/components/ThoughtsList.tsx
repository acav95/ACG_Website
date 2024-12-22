'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { ClientButton } from '@/components/ui'
import type { Thought } from '@/lib/thoughts'

export default function ThoughtsList() {
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchThoughts()
  }, [])

  const fetchThoughts = async () => {
    try {
      const res = await fetch('/api/thoughts')
      if (res.ok) {
        const data = await res.json()
        setThoughts(data)
      }
    } catch (err) {
      console.error('Error fetching thoughts:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this thought?')) return

    try {
      const res = await fetch(`/api/thoughts/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete thought')
      
      fetchThoughts() // Refresh the list
      router.refresh() // Refresh the page
    } catch (err) {
      console.error('Error deleting thought:', err)
    }
  }

  const handleEdit = (slug: string) => {
    router.push(`/admin/thoughts/edit/${slug}`)
  }

  return (
    <div className="space-y-4">
      {thoughts.map((thought) => (
        <div
          key={thought.id}
          className="flex justify-between items-start p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50"
        >
          <div>
            <h3 className="font-medium">{thought.title}</h3>
            <div className="flex gap-2 text-sm text-gray-400">
              <span>{thought.type}</span>
              <span>•</span>
              <span>{thought.date}</span>
            </div>
            <p className="mt-2 text-sm text-gray-400 line-clamp-2">{thought.body}</p>
          </div>
          <div className="flex gap-2">
            <ClientButton
              onClick={() => handleEdit(thought.slug)}
              className="p-2 text-gray-400 hover:text-gray-200"
              title="Edit thought"
            >
              <Pencil className="w-4 h-4" />
            </ClientButton>
            <ClientButton
              onClick={() => handleDelete(thought.id)}
              className="p-2 text-gray-400 hover:text-red-400"
              title="Delete thought"
            >
              <Trash2 className="w-4 h-4" />
            </ClientButton>
          </div>
        </div>
      ))}
    </div>
  )
} 