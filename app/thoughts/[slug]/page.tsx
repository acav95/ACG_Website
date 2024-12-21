import { notFound } from 'next/navigation'

interface Thought {
  id: string;
  title: string;
  type: string;
  body: string;
  date: string;
  slug: string;
}

async function getThought(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/thoughts`, { 
      cache: 'no-store'
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch thoughts`)
    }

    const thoughts = await res.json()
    return thoughts.find((t: Thought) => t.slug === slug)
  } catch (err) {
    console.error('Error fetching thought:', err)
    throw err
  }
}

export default async function ThoughtPage({ params }: { params: { slug: string } }) {
  const thought = await getThought(params.slug)

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
        {thought.body}
      </div>
    </article>
  )
} 