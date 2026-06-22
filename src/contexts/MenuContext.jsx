import { createContext, useContext } from 'react'
import { useMenu } from '../hooks/useMenu'

const MenuContext = createContext(null)

export function MenuProvider({ children }) {
  const menuData = useMenu()
  return (
    <MenuContext.Provider value={menuData}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenuContext() {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenuContext must be used within MenuProvider')
  return ctx
}
