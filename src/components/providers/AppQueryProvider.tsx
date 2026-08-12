import { useEffect, type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { useTaskStore } from '@/store/taskStore'
import { useCategoryStore } from '@/store/categoryStore'
import { taskQueryKeys } from '@/hooks/useTaskQuery'
import { categoryQueryKeys } from '@/hooks/useCategories'

interface AppQueryProviderProps {
  children: ReactNode
}

/** Keeps the query cache in sync with local-first store updates. */
export function AppQueryProvider({ children }: AppQueryProviderProps) {
  useEffect(() => {
    const unsubscribeTasks = useTaskStore.subscribe(({ tasks }) => {
      queryClient.setQueryData(taskQueryKeys.all, tasks)
    })
    const unsubscribeCategories = useCategoryStore.subscribe(({ categories }) => {
      queryClient.setQueryData(categoryQueryKeys.all, categories)
    })

    return () => {
      unsubscribeTasks()
      unsubscribeCategories()
    }
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
