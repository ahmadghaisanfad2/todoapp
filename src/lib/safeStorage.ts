export const safeStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name)
    } catch {
      console.warn(`[safeStorage] Failed to read from localStorage: ${name}`)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch (e) {
      console.error(`[safeStorage] Failed to write to localStorage: ${name}`, e)
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      console.warn(`[safeStorage] Failed to remove from localStorage: ${name}`)
    }
  },
}
