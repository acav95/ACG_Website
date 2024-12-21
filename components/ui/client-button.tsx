'use client'

import { ButtonHTMLAttributes } from 'react'

interface ClientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

export default function ClientButton({ children, className, ...props }: ClientButtonProps) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
} 