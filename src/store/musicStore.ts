import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LOFI_PRESETS } from '@/lib/musicPresets'

interface MusicTrack {
  videoId: string
  title: string
  channel: string
}

type RepeatMode = 'off' | 'one' | 'all'

interface MusicStore {
  currentTrack: MusicTrack | null
  isPlaying: boolean
  volume: number
  isPlayerOpen: boolean
  isSearchOpen: boolean
  isShuffle: boolean
  repeatMode: RepeatMode
  playlist: MusicTrack[]
  setTrack: (track: MusicTrack) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  togglePlayer: () => void
  toggleSearch: () => void
  closeSearch: () => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  nextTrack: () => void
  prevTrack: () => void
  addToPlaylist: (track: MusicTrack) => void
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      volume: 50,
      isPlayerOpen: false,
      isSearchOpen: false,
      isShuffle: false,
      repeatMode: 'off',
      playlist: LOFI_PRESETS.map(p => ({ videoId: p.videoId, title: p.title, channel: p.channel })),
      setTrack: (track) => {
        const { playlist } = get()
        const exists = playlist.some(t => t.videoId === track.videoId)
        if (!exists) {
          set({ currentTrack: track, isPlaying: true, isPlayerOpen: true, playlist: [...playlist, track] })
        } else {
          set({ currentTrack: track, isPlaying: true, isPlayerOpen: true })
        }
      },
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),
      togglePlayer: () => set((s) => ({ isPlayerOpen: !s.isPlayerOpen })),
      toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
      closeSearch: () => set({ isSearchOpen: false }),
      toggleShuffle: () => set((s) => ({ isShuffle: !s.isShuffle })),
      cycleRepeat: () => set((s) => ({
        repeatMode: s.repeatMode === 'off' ? 'all' : s.repeatMode === 'all' ? 'one' : 'off',
      })),
      nextTrack: () => {
        const { currentTrack, playlist, isShuffle, repeatMode } = get()
        if (!currentTrack || playlist.length === 0) return
        const currentIndex = playlist.findIndex(t => t.videoId === currentTrack.videoId)
        if (currentIndex === -1) return
        let nextIndex: number
        if (repeatMode === 'one') {
          set({ isPlaying: true })
          return
        }
        if (isShuffle) {
          do {
            nextIndex = Math.floor(Math.random() * playlist.length)
          } while (nextIndex === currentIndex && playlist.length > 1)
        } else {
          nextIndex = currentIndex + 1
          if (nextIndex >= playlist.length) {
            if (repeatMode === 'all') nextIndex = 0
            else { set({ isPlaying: false }); return }
          }
        }
        set({ currentTrack: playlist[nextIndex], isPlaying: true })
      },
      prevTrack: () => {
        const { currentTrack, playlist, isShuffle } = get()
        if (!currentTrack || playlist.length === 0) return
        const currentIndex = playlist.findIndex(t => t.videoId === currentTrack.videoId)
        if (currentIndex === -1) return
        let prevIndex: number
        if (isShuffle) {
          do {
            prevIndex = Math.floor(Math.random() * playlist.length)
          } while (prevIndex === currentIndex && playlist.length > 1)
        } else {
          prevIndex = currentIndex - 1
          if (prevIndex < 0) prevIndex = playlist.length - 1
        }
        set({ currentTrack: playlist[prevIndex], isPlaying: true })
      },
      addToPlaylist: (track) => {
        const { playlist } = get()
        const exists = playlist.some(t => t.videoId === track.videoId)
        if (!exists) {
          set({ playlist: [...playlist, track] })
        }
      },
    }),
    { name: 'wazheefa-music' }
  )
)

export type { MusicTrack, RepeatMode }
