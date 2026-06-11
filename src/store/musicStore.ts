import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MusicTrack {
  videoId: string
  title: string
  channel: string
}

interface MusicStore {
  currentTrack: MusicTrack | null
  isPlaying: boolean
  volume: number
  isPlayerOpen: boolean
  isSearchOpen: boolean
  setTrack: (track: MusicTrack) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  togglePlayer: () => void
  toggleSearch: () => void
  closeSearch: () => void
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set) => ({
      currentTrack: null,
      isPlaying: false,
      volume: 50,
      isPlayerOpen: false,
      isSearchOpen: false,
      setTrack: (track) => set({ currentTrack: track, isPlaying: true, isPlayerOpen: true }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),
      togglePlayer: () => set((s) => ({ isPlayerOpen: !s.isPlayerOpen })),
      toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
      closeSearch: () => set({ isSearchOpen: false }),
    }),
    { name: 'wazheefa-music' }
  )
)

export type { MusicTrack }
