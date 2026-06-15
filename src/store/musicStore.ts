import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { LOFI_PRESETS } from '@/lib/musicPresets'
import { STORAGE_KEYS } from '@/lib/constants'
import { safeStorage } from '@/lib/safeStorage'
import { useUndoStore } from '@/store/undoStore'

interface MusicTrack {
  videoId: string
  title: string
  channel: string
}

interface Playlist {
  id: string
  name: string
  tracks: MusicTrack[]
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
  history: MusicTrack[]
  playlists: Playlist[]
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
  addToHistory: (track: MusicTrack) => void
  removeFromHistory: (videoId: string) => void
  createPlaylist: (name: string) => void
  deletePlaylist: (id: string) => void
  addTrackToPlaylist: (playlistId: string, track: MusicTrack) => void
  removeTrackFromPlaylist: (playlistId: string, videoId: string) => void
  playPlaylist: (playlistId: string) => void
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
      history: [],
      playlists: [],
      setTrack: (track) => {
        const { playlist, history } = get()
        const exists = playlist.some(t => t.videoId === track.videoId)
        const filtered = history.filter(t => t.videoId !== track.videoId)
        const newHistory = [track, ...filtered].slice(0, 50)
        if (!exists) {
          set({ currentTrack: track, isPlaying: true, isPlayerOpen: true, playlist: [...playlist, track], history: newHistory })
        } else {
          set({ currentTrack: track, isPlaying: true, isPlayerOpen: true, history: newHistory })
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
        const { currentTrack, playlist, history, isShuffle, repeatMode } = get()
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
        const nextTrackItem = playlist[nextIndex]
        const filtered = history.filter(t => t.videoId !== nextTrackItem.videoId)
        set({ currentTrack: nextTrackItem, isPlaying: true, history: [nextTrackItem, ...filtered].slice(0, 50) })
      },
      prevTrack: () => {
        const { currentTrack, playlist, history, isShuffle } = get()
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
        const prevTrackItem = playlist[prevIndex]
        const filtered = history.filter(t => t.videoId !== prevTrackItem.videoId)
        set({ currentTrack: prevTrackItem, isPlaying: true, history: [prevTrackItem, ...filtered].slice(0, 50) })
      },
      addToPlaylist: (track) => {
        const { playlist } = get()
        const exists = playlist.some(t => t.videoId === track.videoId)
        if (!exists) {
          set({ playlist: [...playlist, track] })
        }
      },
      addToHistory: (track) => {
        const { history } = get()
        const filtered = history.filter(t => t.videoId !== track.videoId)
        set({ history: [track, ...filtered].slice(0, 50) })
      },
      removeFromHistory: (videoId) => {
        set((s) => ({ history: s.history.filter(t => t.videoId !== videoId) }))
      },
      createPlaylist: (name) => {
        const { playlists } = get()
        set({ playlists: [...playlists, { id: crypto.randomUUID(), name, tracks: [] }] })
      },
      deletePlaylist: (id) => {
        const playlist = get().playlists.find((p) => p.id === id)
        if (playlist) {
          useUndoStore.getState().pushUndo('Playlist deleted', () => {
            useMusicStore.setState((s) => ({
              playlists: [...s.playlists, playlist],
            }))
          })
        }
        set((s) => ({ playlists: s.playlists.filter(p => p.id !== id) }))
      },
      addTrackToPlaylist: (playlistId, track) => {
        set((s) => ({
          playlists: s.playlists.map(p =>
            p.id === playlistId
              ? { ...p, tracks: p.tracks.some(t => t.videoId === track.videoId) ? p.tracks : [...p.tracks, track] }
              : p
          )
        }))
      },
      removeTrackFromPlaylist: (playlistId, videoId) => {
        const playlist = get().playlists.find((p) => p.id === playlistId)
        if (playlist) {
          useUndoStore.getState().pushUndo('Track removed', () => {
            useMusicStore.setState((s) => ({
              playlists: s.playlists.map((p) =>
                p.id === playlistId ? playlist : p
              ),
            }))
          })
        }
        set((s) => ({
          playlists: s.playlists.map(p =>
            p.id === playlistId
              ? { ...p, tracks: p.tracks.filter(t => t.videoId !== videoId) }
              : p
          )
        }))
      },
      playPlaylist: (playlistId) => {
        const { playlists, history, playlist: prevPlaylist, currentTrack: prevTrack } = get()
        const playlist = playlists.find(p => p.id === playlistId)
        if (!playlist || playlist.tracks.length === 0) return
        useUndoStore.getState().pushUndo('Playlist changed', () => {
          useMusicStore.setState({
            playlist: prevPlaylist,
            currentTrack: prevTrack,
          })
        })
        const firstTrack = playlist.tracks[0]
        const filtered = history.filter(t => t.videoId !== firstTrack.videoId)
        set({
          currentTrack: firstTrack,
          playlist: playlist.tracks,
          isPlaying: true,
          isPlayerOpen: true,
          history: [firstTrack, ...filtered].slice(0, 50),
        })
      },
    }),
    { name: STORAGE_KEYS.MUSIC, storage: createJSONStorage(() => safeStorage) }
  )
)

export type { MusicTrack, Playlist, RepeatMode }
