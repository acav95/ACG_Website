'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DynamicSelect from '@/components/ui/dynamic-select'
import type { Resource } from '@/lib/resources'

export default function NewResource() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resource, setResource] = useState({
    title: '',
    author: '',
    type: '',
    rating: 0,
    comment: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create resource')
      }

      await router.push('/admin/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error creating resource:', error)
      setError(error instanceof Error ? error.message : 'Failed to create resource')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Add New Resource</h1>
      
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
            value={resource.title}
            onChange={(e) => setResource({ ...resource, title: e.target.value })}
            className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Author</label>
          <input
            type="text"
            value={resource.author}
            onChange={(e) => setResource({ ...resource, author: e.target.value })}
            className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <DynamicSelect
          value={resource.type}
          onChange={(value) => setResource({ ...resource, type: value })}
          placeholder="Select type"
          storageKey="resourceTypes"
          defaultOptions={['Book', 'Article', 'Video', 'Course']}
          label="Type"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={resource.rating}
            onChange={(e) => setResource({ ...resource, rating: Number(e.target.value) })}
            className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Comment (Optional)</label>
          <textarea
            value={resource.comment}
            onChange={(e) => setResource({ ...resource, comment: e.target.value })}
            className="w-full h-32 rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
            {isSubmitting ? 'Creating...' : 'Create Resource'}
          </button>
        </div>
      </form>
    </div>
  )
} 