'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import ThoughtsList from './components/ThoughtsList'
import ResourcesList from './components/ResourcesList'
import { ClientLink } from '@/components/ui'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'thoughts' | 'resources'>('thoughts')

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('thoughts')}
            className={`pb-2 ${activeTab === 'thoughts' ? 'border-b-2 border-primary' : ''}`}
          >
            Thoughts
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`pb-2 ${activeTab === 'resources' ? 'border-b-2 border-primary' : ''}`}
          >
            Resources
          </button>
        </div>

        <ClientLink
          href={activeTab === 'thoughts' ? '/admin/thoughts/new' : '/admin/resources/new'}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 px-3 py-1 rounded border border-gray-700"
        >
          <Plus className="w-4 h-4" />
          Add New {activeTab === 'thoughts' ? 'Thought' : 'Resource'}
        </ClientLink>
      </div>

      <div className="space-y-4">
        {activeTab === 'thoughts' ? <ThoughtsList /> : <ResourcesList />}
      </div>
    </div>
  )
} 