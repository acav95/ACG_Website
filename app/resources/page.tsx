'use client'

import { Star, PlusCircle, Edit2, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import DynamicSelect from '@/components/ui/dynamic-select'
import Cookies from 'js-cookie'
import { getBaseUrl } from '@/lib/api'

interface Resource {
  id: string
  title: string
  author: string
  date: string
  rating: number
  comment?: string
  type: string
  fileUrl?: string
}

const defaultResources: Resource[] = [
  {
    id: 'default-1',
    title: "The Pragmatic Programmer",
    author: "Dave Thomas, Andy Hunt",
    date: "2024-10",
    rating: 4,
    type: "Book",
    comment: "A timeless guide to software craftsmanship"
  },
  {
    id: 'default-2',
    title: "Clean Code",
    author: "Robert C. Martin",
    date: "2024-09",
    rating: 5,
    type: "Book"
  },
  {
    id: 'default-3',
    title: "Design Patterns",
    author: "Erich Gamma et al.",
    date: "2024-08",
    rating: 4,
    type: "Book",
    comment: "Essential knowledge for software architecture"
  }
]

function Rating({ rating, onChange }: { rating: number; onChange?: (rating: number) => void }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 cursor-pointer ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
          }`}
          onClick={() => onChange?.(i + 1)}
        />
      ))}
    </div>
  )
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>(defaultResources)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    rating: 0,
    type: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const fetchAdditionalResources = async () => {
    try {
      console.log('Fetching additional resources...')
      const res = await fetch(`${getBaseUrl()}/api/resources`)
      if (!res.ok) throw new Error('Failed to fetch resources')
      const data = await res.json()
      console.log('Fetched resources:', data)
      
      const additionalResources = data.filter((resource: Resource) => 
        !resource.id.startsWith('default-')
      )
      console.log('Additional resources:', additionalResources)
      
      const allResources = [...defaultResources, ...additionalResources]
      console.log('Setting all resources:', allResources)
      setResources(allResources)
    } catch (err) {
      console.error('Error fetching additional resources:', err)
    }
  }

  useEffect(() => {
    const adminToken = Cookies.get('admin-token')
    setIsAdmin(adminToken === 'admin-secret-token-123')
    fetchAdditionalResources()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting new resource:', newResource)

    if (!newResource.title || !newResource.author || !newResource.type) {
      console.log('Missing required fields')
      return
    }

    let fileUrl = newResource.fileUrl
    if (selectedFile) {
      console.log('Uploading file...')
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const data = await response.json()
          fileUrl = data.url
          console.log('File uploaded successfully:', fileUrl)
        }
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }

    try {
      if (newResource.id) {
        console.log('Updating existing resource:', newResource.id)
        const res = await fetch(`/api/resources/${newResource.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newResource, fileUrl }),
        })
        
        if (!res.ok) throw new Error('Failed to update resource')
        console.log('Resource updated successfully')
      } else {
        console.log('Creating new resource')
        const res = await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newResource, fileUrl }),
        })
        
        if (!res.ok) {
          const errorData = await res.json()
          console.error('Server error:', errorData)
          throw new Error('Failed to create resource')
        }
        console.log('Resource created successfully')
      }

      setNewResource({ rating: 0, type: '' })
      setIsAddingNew(false)
      setSelectedFile(null)
      console.log('Form reset, fetching updated resources...')
      fetchAdditionalResources()
    } catch (err) {
      console.error('Error saving resource:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!isAdmin || !confirm('Are you sure you want to delete this resource?')) return
    
    if (id.startsWith('default-')) {
      alert('Cannot delete default resources')
      return
    }

    try {
      const res = await fetch(`${getBaseUrl()}/api/resources/${id}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) throw new Error('Failed to delete resource')
      fetchAdditionalResources()
    } catch (err) {
      console.error('Error deleting resource:', err)
    }
  }

  const handleEdit = async (resource: Resource) => {
    if (!isAdmin) return

    setNewResource({
      id: resource.id,
      title: resource.title,
      author: resource.author,
      type: resource.type,
      rating: resource.rating,
      comment: resource.comment
    })
    setIsAddingNew(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        {isAdmin && (
          <button 
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 px-3 py-1 rounded border border-gray-700"
          >
            <PlusCircle className="w-4 h-4" />
            Add Resource
          </button>
        )}
        <button className="text-gray-400 hover:text-gray-200 px-3 py-1 rounded border border-gray-700">
          Sort by: Date
        </button>
      </div>

      {isAdmin && isAddingNew && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-700 rounded-md">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={newResource.title || ''}
              onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
              className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Author</label>
            <input
              type="text"
              value={newResource.author || ''}
              onChange={(e) => setNewResource({ ...newResource, author: e.target.value })}
              className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <DynamicSelect
            value={newResource.type || ''}
            onChange={(value) => setNewResource({ ...newResource, type: value })}
            placeholder="Select type"
            storageKey="resourceTypes"
            defaultOptions={['Book', 'Article', 'Video', 'Course']}
            label="Type"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium">File (optional)</label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Comment (optional)</label>
            <textarea
              value={newResource.comment || ''}
              onChange={(e) => setNewResource({ ...newResource, comment: e.target.value })}
              className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Rating</label>
            <Rating 
              rating={newResource.rating || 0} 
              onChange={(rating) => setNewResource({ ...newResource, rating })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm"
            >
              Add Resource
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {resources.map((resource) => (
          <div key={resource.id} className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium">{resource.title}</h2>
                <p className="text-gray-400">{resource.author}</p>
                <p className="text-gray-400 text-sm">{resource.type}</p>
                {resource.comment && (
                  <p className="text-gray-400 text-sm mt-1">{resource.comment}</p>
                )}
                {resource.fileUrl && (
                  <a 
                    href={resource.fileUrl}
                    className="text-primary hover:text-primary/80 text-sm mt-1 block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View File
                  </a>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(resource)}
                        className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
                        title="Edit resource"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <Rating rating={resource.rating} />
                </div>
                <span className="text-gray-400 text-sm">{resource.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

