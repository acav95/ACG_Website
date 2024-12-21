export default function Footer() {
  return (
    <footer className="flex gap-6 text-gray-400">
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
    </footer>
  )
} 