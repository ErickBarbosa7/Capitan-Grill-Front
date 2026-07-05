import { useState, useEffect } from 'react'

export function useMinimumLoading(isLoading, delay = 2000) {
  const [showLoader, setShowLoader] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true)
      return
    }

    const timer = setTimeout(() => {
      setShowLoader(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [isLoading, delay])

  return showLoader
}
