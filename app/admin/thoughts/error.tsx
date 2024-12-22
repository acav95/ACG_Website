'use client'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="p-4 bg-red-500/10 border border-red-500 rounded-md">
      <h2 className="text-red-500 font-bold">Something went wrong!</h2>
      <p className="text-red-400 mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Try again
      </button>
    </div>
  )
} 