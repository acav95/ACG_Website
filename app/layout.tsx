import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AdminProvider } from '@/contexts/AdminContext'
import AdminBadge from '@/components/AdminBadge'
import LogoutButton from '@/components/LogoutButton'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ACG Website',
  description: 'Personal website for sharing thoughts and resources',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black text-white`}>
        <AdminProvider>
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-16">
            <Header />
            <main>
              {children}
            </main>
          </div>
          <AdminBadge />
          <LogoutButton />
        </AdminProvider>
      </body>
    </html>
  )
} 