import { Twitter } from 'lucide-react'
import Link from 'next/link'
import { getThoughts, type Thought } from '@/lib/thoughts'

export default async function Thoughts() {
  const thoughts = await getThoughts()
  
  const thoughtsByCategory = thoughts.reduce<Record<string, Thought[]>>((acc, thought) => {
    const category = thought.type.charAt(0).toUpperCase() + thought.type.slice(1)
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(thought)
    return acc
  }, {})

  return (
    <div className="space-y-16">
      {Object.entries(thoughtsByCategory).map(([category, posts]) => (
        <section key={category}>
          <h2 className="text-2xl font-bold mb-6">{category}</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex justify-between items-center group">
                <div className="flex items-center gap-2">
                  {post.type === 'shorter' && (
                    <Twitter className="w-5 h-5 text-gray-400" />
                  )}
                  <Link 
                    href={`/thoughts/${post.slug}`} 
                    className="hover:text-gray-300 transition-colors"
                  >
                    {post.title}
                  </Link>
                </div>
                <span className="text-gray-400">{post.date}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
} 