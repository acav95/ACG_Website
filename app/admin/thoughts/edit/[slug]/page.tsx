'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DynamicSelect from '@/components/ui/dynamic-select'

export default function EditThought({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thought, setThought] = useState({
    title: '',
    type: '',
    body: ''
  })

  useEffect(() => {
    async function fetchThought() {
      try {
        const res = await fetch(`/api/thoughts/${params.slug}`)
        if (!res.ok) throw new Error('Failed to fetch thought')
        const data = await res.json()
        setThought(data)
      } catch (error) {
        setError('Failed to load thought')
      } finally {
        setIsLoading(false)
      }
    }
    fetchThought()
  }, [params.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/thoughts/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(thought)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update thought')
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update thought')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Edit Thought</h1>
      
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
} 