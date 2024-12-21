export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    // Handle VERCEL_URL being `https://domain.vercel.app`
    return process.env.NEXT_PUBLIC_API_URL.startsWith('http') 
      ? process.env.NEXT_PUBLIC_API_URL
      : `https://${process.env.NEXT_PUBLIC_API_URL}`
  }
  return 'http://localhost:3000'
} 