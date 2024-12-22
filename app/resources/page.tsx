import { getResources, type Resource } from '@/lib/resources'
import { Star } from 'lucide-react'

function Rating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
          }`}
        />
      ))}
    </div>
  )
}

export default async function ResourcesPage() {
  const resources = await getResources()

  return (
    <div className="space-y-8">
      {resources.map((resource: Resource) => (
        <div
          key={resource.id}
          className="flex justify-between items-start hover:bg-gray-800/30 p-2 rounded transition-colors"
        >
          <div>
            <h3 className="font-medium">{resource.title}</h3>
            <div className="flex gap-2 text-sm text-gray-400 mt-1">
              <span>{resource.author}</span>
              <span>•</span>
              <span>{resource.type}</span>
            </div>
            {resource.comment && (
              <p className="mt-2 text-sm text-gray-400">{resource.comment}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Rating rating={resource.rating} />
            <span className="text-gray-400 text-sm">{resource.date}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

