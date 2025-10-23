'use client'

import { useState, useEffect } from 'react'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TOCProps {
  items: TOCItem[]
}

export default function TOC({ items }: TOCProps) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const sections = items.map(item => document.getElementById(item.id)).filter(Boolean)
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveId(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [items])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="sticky top-8 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Índice de Contenidos</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className={`block w-full text-left py-2 px-3 rounded-md transition-colors duration-200 ${
                activeId === item.id
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } ${
                item.level === 2 ? 'pl-4 text-sm' : 
                item.level === 3 ? 'pl-8 text-sm' : 
                'text-base'
              }`}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
