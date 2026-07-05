import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import * as menuService from '../services/menuService'

let lastFetchTime = 0
const FETCH_TTL = 5 * 60 * 1000

const CACHE_KEY = 'capitan_menu'

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {}
}

export function useMenu() {
  const { i18n } = useTranslation()
  const [rawCategories, setRawCategories] = useState([])
  const [rawItems, setRawItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const [categories, items] = await Promise.all([
        menuService.getCategories(true),
        menuService.getMenuItems(true),
      ])
      setRawCategories(categories)
      setRawItems(items)
      saveCache({ categories, items })
    } catch (err) {
      const cached = loadCache()
      if (cached) {
        setRawCategories(cached.categories)
        setRawItems(cached.items)
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const cached = loadCache()
    const now = Date.now()

    if (cached) {
      setRawCategories(cached.categories)
      setRawItems(cached.items)
      setLoading(false)
    }

    if (now - lastFetchTime > FETCH_TTL) {
      lastFetchTime = now
      fetchData()
    } else {
      setLoading(false)
    }
  }, [fetchData])

  const notifyUpdate = useCallback(() => {
    try {
      const bc = new BroadcastChannel('capitan_menu')
      bc.postMessage('menu_updated')
      bc.close()
    } catch {}
  }, [])

  const itemMap = useMemo(() => {
    const map = {}
    rawItems.forEach((item) => { map[item.code] = item.id })
    return map
  }, [rawItems])

  const categoryMap = useMemo(() => {
    const map = {}
    rawCategories.forEach((cat) => { map[cat.slug] = cat.id })
    return map
  }, [rawCategories])

  const categories = useMemo(() => {
    const lang = i18n.language
    return rawCategories.map((cat) => ({
      id: cat.slug,
      backendId: cat.id,
      nombre: lang.startsWith('en') ? cat.nameEn : cat.nameEs,
      nombreEs: cat.nameEs,
      nombreEn: cat.nameEn,
      isActive: cat.isActive,
      items: rawItems
        .filter((item) => item.categoryId === cat.id)
        .map((item) => ({
          id: item.code,
          backendId: item.id,
          nombre: lang.startsWith('en') ? item.nameEn : item.nameEs,
          nombreEs: item.nameEs,
          nombreEn: item.nameEn,
          descripcion: lang.startsWith('en') ? item.descriptionEn : item.descriptionEs,
          descripcionEs: item.descriptionEs,
          descripcionEn: item.descriptionEn,
          precio: Number(item.price),
          disponible: item.isAvailable,
          isActive: item.isActive,
          images: item.images || [],
        })),
    }))
  }, [rawCategories, rawItems, i18n.language])

  const createItem = useCallback(async (formData) => {
    const categoryId = categoryMap[formData.categoriaId]
    const res = await menuService.createMenuItem({
      categoryId,
      code: formData.id,
      nameEs: formData.nombreEs,
      nameEn: formData.nombreEn || formData.nombreEs,
      descriptionEs: formData.descripcionEs || '',
      descriptionEn: formData.descripcionEn || formData.descripcionEs || '',
      price: Number(formData.precio),
      isAvailable: formData.disponible,
      images: formData.images || [],
    })
    const newItem = res.item
    setRawItems(prev => {
      const next = [...prev, newItem]
      saveCache({ categories: rawCategories, items: next })
      return next
    })
    notifyUpdate()
  }, [categoryMap, rawCategories, notifyUpdate])

  const updateItem = useCallback(async (code, formData) => {
    const backendId = itemMap[code]
    if (!backendId) throw new Error(`Item ${code} not found`)
    const categoryId = categoryMap[formData.categoriaId]
    const res = await menuService.updateMenuItem(backendId, {
      categoryId,
      code: formData.id,
      nameEs: formData.nombreEs,
      nameEn: formData.nombreEn || formData.nombreEs,
      descriptionEs: formData.descripcionEs || '',
      descriptionEn: formData.descripcionEn || formData.descripcionEs || '',
      price: Number(formData.precio),
      isAvailable: formData.disponible,
      images: formData.images || [],
    })
    const updated = res.item
    setRawItems(prev => {
      const next = prev.map(item => item.id === updated.id ? { ...item, ...updated } : item)
      saveCache({ categories: rawCategories, items: next })
      return next
    })
    notifyUpdate()
  }, [itemMap, categoryMap, rawCategories, notifyUpdate])

  const deleteItem = useCallback(async (code) => {
    const backendId = itemMap[code]
    if (!backendId) throw new Error(`Item ${code} not found`)
    const res = await menuService.deleteMenuItem(backendId)
    const updated = res.item
    setRawItems(prev => {
      const next = prev.map(item => item.id === updated.id ? { ...item, ...updated } : item)
      saveCache({ categories: rawCategories, items: next })
      return next
    })
    notifyUpdate()
  }, [itemMap, rawCategories, notifyUpdate])

  const toggleAvailability = useCallback(async (code) => {
    const backendId = itemMap[code]
    if (!backendId) throw new Error(`Item ${code} not found`)
    const item = rawItems.find((i) => i.code === code)
    const res = await menuService.toggleMenuItem(backendId, !item?.isAvailable)
    const updated = res.item
    setRawItems(prev => {
      const next = prev.map(i => i.id === updated.id ? { ...i, ...updated } : i)
      saveCache({ categories: rawCategories, items: next })
      return next
    })
    notifyUpdate()
  }, [itemMap, rawItems, rawCategories, notifyUpdate])

  const restoreItem = useCallback(async (code) => {
    const backendId = itemMap[code]
    if (!backendId) throw new Error(`Item ${code} not found`)
    const res = await menuService.restoreMenuItem(backendId)
    const updated = res.item
    setRawItems(prev => {
      const next = prev.map(item => item.id === updated.id ? { ...item, ...updated } : item)
      saveCache({ categories: rawCategories, items: next })
      return next
    })
    notifyUpdate()
  }, [itemMap, rawCategories, notifyUpdate])

  const hardDeleteItem = useCallback(async (code) => {
    const backendId = itemMap[code]
    if (!backendId) throw new Error(`Item ${code} not found`)
    await menuService.hardDeleteMenuItem(backendId)
    setRawItems(prev => {
      const next = prev.filter(item => item.id !== backendId)
      saveCache({ categories: rawCategories, items: next })
      return next
    })
    notifyUpdate()
  }, [itemMap, rawCategories, notifyUpdate])

  const createCategory = useCallback(async (data) => {
    const res = await menuService.createCategory(data)
    const newCategory = res.category
    setRawCategories(prev => {
      const next = [...prev, newCategory]
      saveCache({ categories: next, items: rawItems })
      return next
    })
    notifyUpdate()
    return res
  }, [rawItems, notifyUpdate])

  const updateCategory = useCallback(async (slug, data) => {
    const backendId = categoryMap[slug]
    if (!backendId) throw new Error(`Category ${slug} not found`)
    const res = await menuService.updateCategory(backendId, data)
    const updated = res.category
    setRawCategories(prev => {
      const next = prev.map(c => c.id === updated.id ? { ...c, ...updated } : c)
      saveCache({ categories: next, items: rawItems })
      return next
    })
    notifyUpdate()
    return res
  }, [categoryMap, rawItems, notifyUpdate])

  const deleteCategory = useCallback(async (slug) => {
    const backendId = categoryMap[slug]
    if (!backendId) throw new Error(`Category ${slug} not found`)
    const res = await menuService.deleteCategory(backendId)
    const updated = res.category
    setRawCategories(prev => {
      const next = prev.map(c => c.id === updated.id ? { ...c, ...updated } : c)
      saveCache({ categories: next, items: rawItems })
      return next
    })
    notifyUpdate()
    return res
  }, [categoryMap, rawItems, notifyUpdate])

  const hardDeleteCategory = useCallback(async (slug) => {
    const backendId = categoryMap[slug]
    if (!backendId) throw new Error(`Category ${slug} not found`)
    await menuService.hardDeleteCategory(backendId)
    setRawCategories(prev => {
      const next = prev.filter(c => c.id !== backendId)
      saveCache({ categories: next, items: rawItems })
      return next
    })
    notifyUpdate()
  }, [categoryMap, rawItems, notifyUpdate])

  const restoreCategory = useCallback(async (slug) => {
    const backendId = categoryMap[slug]
    if (!backendId) throw new Error(`Category ${slug} not found`)
    const res = await menuService.restoreCategory(backendId)
    const updated = res.category
    setRawCategories(prev => {
      const next = prev.map(c => c.id === updated.id ? { ...c, ...updated } : c)
      saveCache({ categories: next, items: rawItems })
      return next
    })
    notifyUpdate()
    return res
  }, [categoryMap, rawItems, notifyUpdate])

  return {
    categories,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    toggleAvailability,
    restoreItem,
    hardDeleteItem,
    createCategory,
    updateCategory,
    deleteCategory,
    hardDeleteCategory,
    restoreCategory,
    refetch: fetchData,
    notifyUpdate,
  }
}
