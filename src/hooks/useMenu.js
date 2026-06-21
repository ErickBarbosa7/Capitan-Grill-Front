import menuData from '../data/menu.json';
import { useMemo } from 'react';

export function useMenu() {
  const categories = useMemo(() => menuData.categorias, []);
  return { categories };
}
