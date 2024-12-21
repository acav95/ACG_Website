export default function HomePage() {
  return (
    <div className="space-y-12">
      <p className="text-xl leading-relaxed max-w-4xl">
        At the intersection of technology and creativity, I explore the boundaries of 
        what's possible in software engineering. Through innovative solutions and 
        thoughtful design, I aim to create meaningful digital experiences that push the 
        industry forward.
      </p>

      <div className="flex gap-6 text-gray-400">
        <a 
          href="https://twitter.com" 
          className="text-l hover:text-gray-200 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
        <a 
          href="https://github.com" 
          className="text-l hover:text-gray-200 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </div>
    </div>
  )
} 