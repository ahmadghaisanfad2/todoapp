# Lofi Music Player Implementation Plan

> [!NOTE]
> This document may not reflect the current implementation.
> See the final report for up-to-date state:
> [Final Report](../reports/lofi-music-player.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating lofi music player with YouTube search and preset channels to the Wazheefa task app.

**Architecture:** A Zustand store manages playback state and persists the last track. A hidden YouTube iframe is controlled via `postMessage`. A floating bottom bar provides playback controls, and a sheet dialog handles YouTube search and preset selection.

**Tech Stack:** React 19, Zustand 5, YouTube IFrame API (via embed + postMessage), lucide-react icons, shadcn/ui (Sheet, Input, Button)

---

### Task 1: Music Player Zustand Store

**Covers:** Core state management for playback

**Files:**
- Create: `src/store/musicStore.ts`

- [ ] **Step 1: Create the music store**

```typescript
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 2: YouTube Player Hook

**Covers:** YouTube iframe control via postMessage

**Files:**
- Create: `src/hooks/useYouTubePlayer.ts`

- [ ] **Step 1: Create the YouTube player hook**

```typescript
import { useEffect, useRef, useCallback } from 'react'
import { useMusicStore } from '@/store/musicStore'

export function useYouTubePlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { currentTrack, isPlaying, volume, setIsPlaying, setVolume } = useMusicStore()

  const postMessage = useCallback((command: string, args?: unknown[]) => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return
    iframe.contentWindow.postMessage(JSON.stringify({
      event: 'command',
      func: command,
      args: args || [],
    }), '*')
  }, [])

  const play = useCallback(() => {
    postMessage('playVideo')
    setIsPlaying(true)
  }, [postMessage, setIsPlaying])

  const pause = useCallback(() => {
    postMessage('pauseVideo')
    setIsPlaying(false)
  }, [postMessage, setIsPlaying])

  const togglePlayPause = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  useEffect(() => {
    if (!currentTrack) return
    const iframe = iframeRef.current
    if (!iframe) return
    const url = `https://www.youtube.com/embed/${currentTrack.videoId}?enablejsapi=1&origin=${window.location.origin}`
    iframe.src = url
  }, [currentTrack?.videoId])

  useEffect(() => {
    if (!iframeRef.current) return
    postMessage('setVolume', [volume])
    setVolume(volume)
  }, [volume, postMessage, setVolume])

  useEffect(() => {
    if (!currentTrack) return
    if (isPlaying) postMessage('playVideo')
    else postMessage('pauseVideo')
  }, [isPlaying, currentTrack, postMessage])

  return {
    iframeRef,
    play,
    pause,
    togglePlayPause,
  }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 3: Preset Channels Data

**Covers:** Curated lofi channel presets

**Files:**
- Create: `src/lib/musicPresets.ts`

- [ ] **Step 1: Create the presets file**

```typescript
export interface MusicPreset {
  videoId: string
  title: string
  channel: string
  thumbnail: string
}

export const LOFI_PRESETS: MusicPreset[] = [
  {
    videoId: 'jfKfPfyJRdk',
    title: 'Lofi Girl Radio',
    channel: 'Lofi Girl',
    thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg',
  },
  {
    videoId: '4xDzrJKXOOY',
    title: 'Synthwave Radio',
    channel: 'Lofi Girl',
    thumbnail: 'https://img.youtube.com/vi/4xDzrJKXOOY/mqdefault.jpg',
  },
  {
    videoId: 'HuFYqnbVbzY',
    title: 'Chillhop Radio',
    channel: 'Chillhop Music',
    thumbnail: 'https://img.youtube.com/vi/HuFYqnbVbzY/mqdefault.jpg',
  },
  {
    videoId: '5qap5aO4i9A',
    title: 'Lofi Beats',
    channel: 'Trap City',
    thumbnail: 'https://img.youtube.com/vi/5qap5aO4i9A/mqdefault.jpg',
  },
  {
    videoId: 'rUxyKA_-grg',
    title: 'Jazz Lofi',
    channel: 'Jazz Lofi',
    thumbnail: 'https://img.youtube.com/vi/rUxyKA_-grg/mqdefault.jpg',
  },
]
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 4: MusicSearchSheet Component

**Covers:** YouTube search UI and preset selection

**Files:**
- Create: `src/components/music/MusicSearchSheet.tsx`

- [ ] **Step 1: Create the search sheet component**

```tsx
import { useState, useCallback } from 'react'
import { Search, Play } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMusicStore } from '@/store/musicStore'
import { LOFI_PRESETS } from '@/lib/musicPresets'
import type { MusicTrack } from '@/store/musicStore'

interface SearchResult {
  videoId: string
  title: string
  channel: string
  thumbnail: string
}

interface MusicSearchSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MusicSearchSheet({ open, onOpenChange }: MusicSearchSheetProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const setTrack = useMusicStore((s) => s.setTrack)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return
    setIsSearching(true)
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' lofi')}&type=video&videoCategoryId=10&maxResults=8&key=AIzaSyDummy`
      )
      if (!res.ok) throw new Error('API not available')
      const data = await res.json()
      setResults(
        data.items?.map((item: { id: { videoId: string }; snippet: { title: string; channelTitle: string; thumbnails: { medium: { url: string } } } }) => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium.url,
        })) || []
      )
    } catch {
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [query])

  const handleSelect = (track: MusicTrack) => {
    setTrack(track)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Find Lofi Music</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search YouTube..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
            {isSearching ? '...' : 'Search'}
          </Button>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Quick Picks
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {LOFI_PRESETS.map((preset) => (
              <button
                key={preset.videoId}
                onClick={() => handleSelect(preset)}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
              >
                <img
                  src={preset.thumbnail}
                  alt={preset.title}
                  className="h-12 w-16 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{preset.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{preset.channel}</p>
                </div>
                <Play className="h-4 w-4 shrink-0 text-primary" />
              </button>
            ))}
          </div>
        </div>

        {results.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Search Results
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {results.map((result) => (
                <button
                  key={result.videoId}
                  onClick={() => handleSelect(result)}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    className="h-12 w-16 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{result.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{result.channel}</p>
                  </div>
                  <Play className="h-4 w-4 shrink-0 text-primary" />
                </button>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 5: MusicPlayerBar Component

**Covers:** Floating bottom player bar

**Files:**
- Create: `src/components/music/MusicPlayerBar.tsx`

- [ ] **Step 1: Create the player bar component**

```tsx
import { Volume2, VolumeX, Music, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMusicStore } from '@/store/musicStore'
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer'
import { cn } from '@/lib/utils'

interface MusicPlayerBarProps {
  onOpenSearch: () => void
}

export function MusicPlayerBar({ onOpenSearch }: MusicPlayerBarProps) {
  const { currentTrack, isPlaying, volume, isPlayerOpen, setVolume, togglePlayer } = useMusicStore()
  const { iframeRef, togglePlayPause } = useYouTubePlayer()

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Hidden YouTube iframe */}
      <iframe
        ref={iframeRef}
        className="pointer-events-none absolute opacity-0"
        width="0"
        height="0"
        allow="autoplay; encrypted-media"
        title="Music Player"
      />

      {/* Collapsed mini-player */}
      {!isPlayerOpen && (
        <div className="border-t border-border/60 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
            <button
              onClick={togglePlayer}
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <div className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10',
                isPlaying && 'animate-pulse'
              )}>
                <Music className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-medium">{currentTrack.title}</p>
                <p className="truncate text-xs text-muted-foreground">{currentTrack.channel}</p>
              </div>
            </button>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                className="h-9 w-9"
              >
                {isPlaying ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenSearch}
                className="h-9 w-9"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded player */}
      {isPlayerOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full bg-primary/10',
                  isPlaying && 'animate-pulse'
                )}>
                  <Music className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{currentTrack.title}</p>
                  <p className="text-sm text-muted-foreground">{currentTrack.channel}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayer}
                className="h-9 w-9"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                className="h-10 w-10"
              >
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </Button>

              <div className="flex flex-1 items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVolume(volume === 0 ? 50 : 0)}
                  className="h-8 w-8"
                >
                  {volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-primary"
                />
              </div>
            </div>

            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenSearch}
                className="w-full gap-2 text-sm"
              >
                <Music className="h-3.5 w-3.5" />
                Change track
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

---

### Task 6: Integrate into AppPage and Header

**Covers:** Wiring music player into the app

**Files:**
- Modify: `src/pages/AppPage.tsx`
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Add music button to Header**

In `src/components/layout/Header.tsx`, add a `Music` icon button:

```tsx
import { Sun, Moon, Monitor, Tags, Plus, Music } from 'lucide-react'
```

Add a new prop `onMusicOpen` and a button after the theme button:

```tsx
interface HeaderProps {
  onCategoryOpen: () => void
  onAddTask: () => void
  onMusicOpen: () => void
}
```

Add the button in the `div` with other buttons:

```tsx
<Button
  variant="ghost"
  size="sm"
  onClick={onMusicOpen}
  aria-label="Music player"
  className="gap-1.5 px-2.5"
>
  <Music className="h-4 w-4" />
  <span className="hidden text-xs sm:inline">Music</span>
</Button>
```

- [ ] **Step 2: Add music components to AppPage**

In `src/pages/AppPage.tsx`, import and wire up the music components:

```tsx
import { MusicPlayerBar } from '@/components/music/MusicPlayerBar'
import { MusicSearchSheet } from '@/components/music/MusicSearchSheet'
import { useMusicStore } from '@/store/musicStore'
```

Add state from the store:

```tsx
const isSearchOpen = useMusicStore((s) => s.isSearchOpen)
const toggleSearch = useMusicStore((s) => s.toggleSearch)
const closeSearch = useMusicStore((s) => s.closeSearch)
```

Update the Header usage:

```tsx
<Header onCategoryOpen={() => setCategorySheetOpen(true)} onAddTask={handleAddTask} onMusicOpen={toggleSearch} />
```

Add the music components before the closing `</div>`:

```tsx
<MusicPlayerBar onOpenSearch={toggleSearch} />
<MusicSearchSheet open={isSearchOpen} onOpenChange={closeSearch} />
```

Add bottom padding to account for the player bar:

```tsx
<div className="min-h-[100dvh] bg-background pb-16">
```

- [ ] **Step 3: Verify full app compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: Build succeeds

---

### Task 7: Add range input styling

**Covers:** Volume slider visual styling

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add range input styles**

Add to the `@layer base` section:

```css
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 9999px;
  background: hsl(var(--border));
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 2px solid hsl(var(--background));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 2px solid hsl(var(--background));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds
