import { QueryClient } from '@tanstack/react-query'

/**
 * The app currently persists its data locally. TanStack Query still gives us a
 * single cache and mutation lifecycle, while Zustand remains the durable
 * local-first store underneath it.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})
