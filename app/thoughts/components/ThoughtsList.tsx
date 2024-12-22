'use client'

import { Twitter } from 'lucide-react'
import Link from 'next/link'
import type { Thought } from '@/lib/thoughts'

interface ThoughtItemProps {
  thought: Thought
}

function ThoughtItem({ thought }: ThoughtItemProps) {
  return (
    <Link 
      href={`/thoughts/${thought.slug}`}
      className="flex justify-between items-center group hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2">
        {thought.type === 'shorter' && (
          <Twitter className="w-5 h-5 text-gray-400" />
        )}
        <h3 className="group-hover:text-gray-300 transition-colors">
          {thought.title}
        </h3>
      </div>
      <span className="text-gray-400">{thought.date}</span>
    </Link>
  )
}

interface ThoughtsListProps {
  thoughtsByCategory: Record<string, Thought[]>
}

export default function ThoughtsList({ thoughtsByCategory }: ThoughtsListProps) {
  return (
    <div className="space-y-16">
      {Object.entries(thoughtsByCategory).map(([category, posts]) => (
        <section key={category}>
          <h2 className="text-2xl font-bold mb-6">{category}</h2>
          <div className="space-y-2">
            {posts.map((thought) => (
              <ThoughtItem key={thought.id} thought={thought} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
} 