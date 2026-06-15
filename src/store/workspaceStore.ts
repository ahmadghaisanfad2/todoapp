import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Workspace } from '@/types'
import { generateId } from '@/lib/utils'
import { STORAGE_KEYS, DEFAULT_WORKSPACE_NAME, DEFAULT_WORKSPACE_COLOR } from '@/lib/constants'

const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name)
    } catch {
      console.warn(`[workspaceStore] Failed to read from localStorage: ${name}`)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch (e) {
      console.error(`[workspaceStore] Failed to write to localStorage: ${name}`, e)
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      console.warn(`[workspaceStore] Failed to remove from localStorage: ${name}`)
    }
  },
}

interface WorkspaceStore {
  workspaces: Workspace[]
  activeWorkspaceId: string
  addWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt'>) => string
  updateWorkspace: (id: string, updates: Partial<Omit<Workspace, 'id' | 'createdAt'>>) => void
  deleteWorkspace: (id: string) => void
  setActiveWorkspace: (id: string) => void
  getActiveWorkspace: () => Workspace | undefined
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      workspaces: [],
      activeWorkspaceId: '',
      addWorkspace: (workspace) => {
        const id = generateId()
        set((state) => ({
          workspaces: [
            ...state.workspaces,
            {
              ...workspace,
              id,
              createdAt: new Date().toISOString(),
            },
          ],
        }))
        return id
      },
      updateWorkspace: (id, updates) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })),
      deleteWorkspace: (id) =>
        set((state) => {
          const remaining = state.workspaces.filter((w) => w.id !== id)
          const needsSwitch = state.activeWorkspaceId === id
          return {
            workspaces: remaining,
            activeWorkspaceId: needsSwitch
              ? (remaining[0]?.id ?? '')
              : state.activeWorkspaceId,
          }
        }),
      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
      getActiveWorkspace: () => {
        const state = get()
        return state.workspaces.find((w) => w.id === state.activeWorkspaceId)
      },
    }),
    {
      name: STORAGE_KEYS.WORKSPACES,
      storage: createJSONStorage(() => safeStorage),
    }
  )
)

/** Ensures at least one workspace exists and sets it active. Returns the active workspace id. */
export function ensureDefaultWorkspace(): string {
  const state = useWorkspaceStore.getState()
  if (state.workspaces.length === 0) {
    const id = state.addWorkspace({
      name: DEFAULT_WORKSPACE_NAME,
      color: DEFAULT_WORKSPACE_COLOR,
    })
    state.setActiveWorkspace(id)
    return id
  }
  if (!state.activeWorkspaceId || !state.workspaces.find((w) => w.id === state.activeWorkspaceId)) {
    state.setActiveWorkspace(state.workspaces[0].id)
  }
  return state.activeWorkspaceId
}
