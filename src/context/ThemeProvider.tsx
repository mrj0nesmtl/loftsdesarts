'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Script to prevent flashing by setting theme immediately on page load
const themeScript = `
  (function() {
    try {
      const storedTheme = localStorage.getItem('theme')
      if (storedTheme === 'light' || storedTheme === 'dark') {
        document.documentElement.classList.toggle('dark', storedTheme === 'dark')
        document.documentElement.setAttribute('data-theme', storedTheme)
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.classList.toggle('dark', isDark)
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
      }
    } catch (e) {}
  })()
`

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)
  
  // Handle theme change
  const applyTheme = (newTheme: Theme) => {
    // Update DOM
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    document.documentElement.setAttribute('data-theme', newTheme)
    
    // Save to localStorage
    try {
      localStorage.setItem('theme', newTheme)
    } catch (e) {
      console.error('Failed to save theme to localStorage', e)
    }
  }
  
  // Toggle between themes
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    applyTheme(newTheme)
  }
  
  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)
    // Check localStorage first
    try {
      const storedTheme = localStorage.getItem('theme') as Theme | null
      
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme)
      } else {
        // Use system preference as fallback
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(prefersDark ? 'dark' : 'light')
      }
    } catch (e) {
      console.error('Failed to read theme from localStorage', e)
    }
  }, [])
  
  // Apply theme whenever it changes
  useEffect(() => {
    if (mounted) {
      applyTheme(theme)
    }
  }, [theme, mounted])
  
  // Listen for system preference changes
  useEffect(() => {
    if (!mounted) return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change if the user hasn't explicitly set a preference
      try {
        const hasStoredPreference = localStorage.getItem('theme') !== null
        if (!hasStoredPreference) {
          const newTheme = e.matches ? 'dark' : 'light'
          setTheme(newTheme)
          applyTheme(newTheme)
        }
      } catch (e) {
        console.error('Failed to check theme preference', e)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mounted])
  
  return (
    <>
      {/* Inject script to handle theme before React hydration */}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      
      <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 