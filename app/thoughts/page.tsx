import { getThoughts } from '@/lib/thoughts'
import Link from 'next/link'

export default async function ThoughtsPage() {
  const thoughts = await getThoughts()
  
  const thoughtsByCategory = thoughts.reduce<Record<string, any[]>>((acc, thought) => {
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
              <Link
                key={post.id}
                href={`/thoughts/${post.slug}`}
                className="flex justify-between items-start hover:bg-gray-800/30 p-2 rounded transition-colors"
              >
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {post.body}
                  </p>
                </div>
                <span className="text-gray-400 text-sm">{post.date}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
} 