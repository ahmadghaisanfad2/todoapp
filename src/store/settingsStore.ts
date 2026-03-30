import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings } from '@/types'

interface SettingsStore extends AppSettings {
  setTheme: (theme: AppSettings['theme']) => void
  setSortBy: (sortBy: AppSettings['sortBy']) => void
  setFilterStatus: (filterStatus: AppSettings['filterStatus']) => void
  setFilterCategoryId: (filterCategoryId: string | null) => void
  setFilterPriority: (filterPriority: AppSettings['filterPriority']) => void
  resetFilters: () => void
}

const defaultSettings: AppSettings = {
  theme: 'system',
  sortBy: 'createdAt',
  filterStatus: 'all',
  filterCategoryId: null,
  filterPriority: 'all',
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setTheme: (theme) => set({ theme }),
      setSortBy: (sortBy) => set({ sortBy }),
      setFilterStatus: (filterStatus) => set({ filterStatus }),
      setFilterCategoryId: (filterCategoryId) => set({ filterCategoryId }),
      setFilterPriority: (filterPriority) => set({ filterPriority }),
      resetFilters: () =>
        set({
          filterStatus: defaultSettings.filterStatus,
          filterCategoryId: defaultSettings.filterCategoryId,
          filterPriority: defaultSettings.filterPriority,
        }),
    }),
    { name: 'todoflow-settings' }
  )
)
