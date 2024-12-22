import { notFound } from 'next/navigation'
import { getThoughts } from '@/lib/thoughts'

export default async function ThoughtPage({ params }: { params: { slug: string } }) {
  const thoughts = await getThoughts()
  const thought = thoughts.find(t => t.slug === params.slug)

  if (!thought) {
    notFound()
  }

  return (
    <article className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">{thought.title}</h1>
        <div className="flex items-center justify-between text-gray-400">
          <span className="capitalize">{thought.type}</span>
          <time>{thought.date}</time>
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        {thought.body.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
} 