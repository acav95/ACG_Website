'use client'

import { useState, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'

interface DynamicSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  storageKey: string
  defaultOptions?: string[]
  label?: string
}

export default function DynamicSelect({
  value,
  onChange,
  placeholder = 'Select an option',
  storageKey,
  defaultOptions = [],
  label
}: DynamicSelectProps) {
  const [options, setOptions] = useState<string[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newValue, setNewValue] = useState('')

  useEffect(() => {
    const savedOptions = localStorage.getItem(storageKey)
    if (savedOptions) {
      setOptions(JSON.parse(savedOptions))
    } else {
      setOptions(defaultOptions)
      localStorage.setItem(storageKey, JSON.stringify(defaultOptions))
    }
  }, [storageKey, defaultOptions])

  const handleAddNew = () => {
    if (newValue.trim()) {
      const updatedOptions = [...options, newValue.trim()]
      setOptions(updatedOptions)
      localStorage.setItem(storageKey, JSON.stringify(updatedOptions))
      onChange(newValue.trim())
      setNewValue('')
      setIsAddingNew(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isAddingNew) {
      e.preventDefault()
      handleAddNew()
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        {isAddingNew ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter new type"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddNew}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{placeholder}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-1 px-3 py-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              New Type
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 