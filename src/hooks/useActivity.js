import { useState, useEffect, useCallback } from 'react'
import { getActivity } from '../services/menuService'

let cache = null
let lastFetch = 0
let currentPromise = null
const CACHE_TTL = 30000

export function useActivity({ pollInterval = 0 } = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async (force) => {
    const now = Date.now()
    if (!force && cache && now - lastFetch < CACHE_TTL) {
      setData(cache)
      setLoading(false)
      return
    }
    if (currentPromise) {
      const result = await currentPromise
      setData(result)
      setLoading(false)
      return
    }
    currentPromise = getActivity()
    try {
      const result = await currentPromise
      cache = result
      lastFetch = now
      setData(result)
    } catch {
    } finally {
      currentPromise = null
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    if (pollInterval > 0) {
      const id = setInterval(() => fetch(true), pollInterval)
      return () => clearInterval(id)
    }
  }, [fetch, pollInterval])

  return { data, loading, refetch: () => fetch(true) }
}
