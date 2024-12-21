'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Plus, Book, BrainCircuit } from 'lucide-react'
import ClientButton from '@/components/ui/client-button'
import ClientLink from '@/components/ui/client-link'
import ThoughtsList from './components/ThoughtsList'
import ResourcesList from './components/ResourcesList'

type ContentType = 'thoughts' | 'resources'

interface Thought {
  id: string
  title: string
  type: string
  body: string
  date: string
  slug: string
}

interface Resource {
  id: number
  title: string
  author: string
  date: string
  rating: number
  comment?: string
  type: string
  fileUrl?: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ContentType>('thoughts')
  const router = useRouter()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <ClientButton
          onClick={() => router.push('/')}
          className="text-gray-400 hover:text-gray-200"
        >
          Exit Dashboard
        </ClientButton>
      </div>

      <div className="flex gap-4 border-b border-gray-700">
        <ClientButton
          className={`px-4 py-2 ${
            activeTab === 'thoughts' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('thoughts')}
        >
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" />
            Thoughts
          </div>
        </ClientButton>
        <ClientButton
          className={`px-4 py-2 ${
            activeTab === 'resources' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('resources')}
        >
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            Resources
          </div>
        </ClientButton>
      </div>

      <div className="flex justify-end">
        <ClientLink
          href={activeTab === 'thoughts' ? '/admin' : '/resources'}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add New {activeTab === 'thoughts' ? 'Thought' : 'Resource'}
        </ClientLink>
      </div>

      <div className="space-y-4">
        {activeTab === 'thoughts' ? (
          <ThoughtsList />
        ) : (
          <ResourcesList />
        )}
      </div>
    </div>
  )
} 