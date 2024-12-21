'use client'

import Link from 'next/link'
import { ComponentProps } from 'react'

interface ClientLinkProps extends ComponentProps<typeof Link> {
  className?: string
}

export default function ClientLink({ children, className, ...props }: ClientLinkProps) {
  return (
    <Link className={className} {...props}>
      {children}
    </Link>
  )
} 