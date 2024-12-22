'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DynamicSelect from '@/components/ui/dynamic-select'

export default function NewThought() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thought, setThought] = useState({
    title: '',
    type: '',
    body: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch(`${window.location.origin}/api/thoughts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(thought)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create thought')
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error creating thought:', error)
      setError(error instanceof Error ? error.message : 'Failed to create thought')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Add New Thought</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-md text-red-500">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={thought.title}
            onChange={(e) => setThought({ ...thought, title: e.target.value })}
            className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <DynamicSelect
          value={thought.type}
          onChange={(value) => setThought({ ...thought, type: value })}
          placeholder="Select type"
          storageKey="thoughtTypes"
          defaultOptions={['longer', 'shorter']}
          label="Type"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">Content</label>
          <textarea
            value={thought.body}
            onChange={(e) => setThought({ ...thought, body: e.target.value })}
            className="w-full h-64 rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Thought'}
          </button>
        </div>
      </form>
    </div>
  )
} 