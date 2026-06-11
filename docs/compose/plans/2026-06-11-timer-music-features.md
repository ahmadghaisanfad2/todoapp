# Timer UX + Music History/Playlists Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix timer UX issues, add hour customization and first-open hint, add music playback history and group playlists, and fix music button readability.

**Architecture:** Extend existing stores with new fields (history, playlists), update existing components (TimerWidget, TimerSetup, MusicSearchSheet, MusicPlayerBar), and add localStorage persistence for new state.

**Tech Stack:** React 19, TypeScript, Zustand with persist, Tailwind CSS v4, localStorage

---

## File Structure

| File | Change |
|---|---|
| `src/components/timer/TimerWidget.tsx` | Add click-outside-to-close, first-open tooltip hint |
| `src/components/timer/TimerSetup.tsx` | Add hour+minute custom input |
| `src/store/musicStore.ts` | Add history, playlists, removeFromHistory, playlist CRUD |
| `src/components/music/MusicSearchSheet.tsx` | Add history section, playlists section |
| `src/components/music/MusicPlayerBar.tsx` | Fix music button readability |

---

### Task 1: Fix Timer Click-Outside-to-Close

**Files:**
- Modify: `src/components/timer/TimerWidget.tsx`

- [ ] **Step 1: Add click-outside handler to TimerWidget**

Add `useRef` and `useEffect` imports. Create a ref for the widget container. When `isExpanded` is true, listen for `mousedown` events on `document`. If the click target is outside the ref, set `isExpanded` to false.

```tsx
import { useState, useRef, useEffect } from 'react'
```

Add ref:
```tsx
const widgetRef = useRef<HTMLDivElement>(null)
```

Add effect:
```tsx
useEffect(() => {
  if (!isExpanded) return
  const handleClickOutside = (e: MouseEvent) => {
    if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
      setIsExpanded(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [isExpanded])
```

Attach ref to the outermost container div:
```tsx
<div ref={widgetRef} className="fixed bottom-6 right-6 z-[60]"
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

---

### Task 2: Add Hour+Minute Custom Input to TimerSetup

**Files:**
- Modify: `src/components/timer/TimerSetup.tsx`

- [ ] **Step 1: Replace single input with hours+minutes inputs**

Replace the custom input section with two inputs:

```tsx
const [customHours, setCustomHours] = useState('')
const [customMinutes, setCustomMinutes] = useState('')

const handleCustomStart = () => {
  const hrs = parseInt(customHours, 10) || 0
  const mins = parseInt(customMinutes, 10) || 0
  const totalSeconds = hrs * 3600 + mins * 60
  if (totalSeconds > 0 && totalSeconds <= 14400) { // max 4 hours
    onStart(totalSeconds)
    setCustomHours('')
    setCustomMinutes('')
  }
}
```

Update the JSX to show two inputs side by side:
```tsx
<div className="flex items-center gap-2">
  <div className="flex items-center gap-1 flex-1">
    <Input
      type="number"
      min={0}
      max={4}
      placeholder="Jam"
      value={customHours}
      onChange={(e) => setCustomHours(e.target.value)}
      className="h-9 text-sm w-16"
    />
    <span className="text-xs text-muted-foreground">jam</span>
    <Input
      type="number"
      min={0}
      max={59}
      placeholder="Menit"
      value={customMinutes}
      onChange={(e) => setCustomMinutes(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleCustomStart()}
      className="h-9 text-sm w-16"
    />
    <span className="text-xs text-muted-foreground">mnt</span>
  </div>
  <Button
    size="sm"
    onClick={handleCustomStart}
    disabled={(!customHours && !customMinutes) || (parseInt(customHours, 10) || 0) * 3600 + (parseInt(customMinutes, 10) || 0) * 60 <= 0}
    className="h-9 px-3"
  >
    <Play className="h-3.5 w-3.5" />
  </Button>
</div>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

---

### Task 3: Add First-Open Timer Hint Tooltip

**Files:**
- Modify: `src/components/timer/TimerWidget.tsx`

- [ ] **Step 1: Add tooltip state and localStorage check**

Add state for showing the hint:
```tsx
const [showHint, setShowHint] = useState(() => {
  return !localStorage.getItem('wazheefa-timer-hint-seen')
})
```

Add effect to auto-dismiss after 5 seconds:
```tsx
useEffect(() => {
  if (!showHint) return
  const timer = setTimeout(() => {
    setShowHint(false)
    localStorage.setItem('wazheefa-timer-hint-seen', 'true')
  }, 5000)
  return () => clearTimeout(timer)
}, [showHint])
```

- [ ] **Step 2: Add tooltip JSX above the timer button**

When `!isExpanded` and timer is idle, show the hint:
```tsx
{showHint && !isExpanded && (
  <div className="absolute bottom-full right-0 mb-3 px-3 py-2 rounded-lg bg-foreground text-background text-xs font-medium shadow-lg whitespace-nowrap animate-hero-fade-1">
    Ada timer fokus di sini!
    <div className="absolute top-full right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-foreground" />
  </div>
)}
```

Dismiss on click of the timer button:
```tsx
onClick={() => {
  setIsExpanded(true)
  if (showHint) {
    setShowHint(false)
    localStorage.setItem('wazheefa-timer-hint-seen', 'true')
  }
}}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

---

### Task 4: Add History and Playlists to Music Store

**Files:**
- Modify: `src/store/musicStore.ts`

- [ ] **Step 1: Add history and playlists to the store interface**

```tsx
interface Playlist {
  id: string
  name: string
  tracks: MusicTrack[]
}

interface MusicStore {
  // ... existing fields ...
  history: MusicTrack[]
  playlists: Playlist[]
  addToHistory: (track: MusicTrack) => void
  removeFromHistory: (videoId: string) => void
  createPlaylist: (name: string) => void
  deletePlaylist: (id: string) => void
  addToPlaylist: (playlistId: string, track: MusicTrack) => void
  removeFromPlaylist: (playlistId: string, videoId: string) => void
  playPlaylist: (playlistId: string) => void
}
```

- [ ] **Step 2: Implement history actions**

```tsx
history: [],
playlists: [],
addToHistory: (track) => {
  const { history } = get()
  const filtered = history.filter(t => t.videoId !== track.videoId)
  set({ history: [track, ...filtered].slice(0, 50) }) // max 50
},
removeFromHistory: (videoId) => {
  set((s) => ({ history: s.history.filter(t => t.videoId !== videoId) }))
},
```

- [ ] **Step 3: Implement playlist actions**

```tsx
createPlaylist: (name) => {
  const { playlists } = get()
  set({ playlists: [...playlists, { id: crypto.randomUUID(), name, tracks: [] }] })
},
deletePlaylist: (id) => {
  set((s) => ({ playlists: s.playlists.filter(p => p.id !== id) }))
},
addToPlaylist: (playlistId, track) => {
  set((s) => ({
    playlists: s.playlists.map(p => 
      p.id === playlistId 
        ? { ...p, tracks: p.tracks.some(t => t.videoId === track.videoId) ? p.tracks : [...p.tracks, track] }
        : p
    )
  }))
},
removeFromPlaylist: (playlistId, videoId) => {
  set((s) => ({
    playlists: s.playlists.map(p =>
      p.id === playlistId
        ? { ...p, tracks: p.tracks.filter(t => t.videoId !== videoId) }
        : p
    )
  }))
},
playPlaylist: (playlistId) => {
  const { playlists } = get()
  const playlist = playlists.find(p => p.id === playlistId)
  if (!playlist || playlist.tracks.length === 0) return
  set({ currentTrack: playlist.tracks[0], isPlaying: true, isPlayerOpen: true })
},
```

- [ ] **Step 4: Update setTrack to add to history**

In the existing `setTrack` action, add `addToHistory` call:
```tsx
setTrack: (track) => {
  const { playlist } = get()
  const exists = playlist.some(t => t.videoId === track.videoId)
  get().addToHistory(track)
  if (!exists) {
    set({ currentTrack: track, isPlaying: true, isPlayerOpen: true, playlist: [...playlist, track] })
  } else {
    set({ currentTrack: track, isPlaying: true, isPlayerOpen: true })
  }
},
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

---

### Task 5: Add History and Playlists to MusicSearchSheet

**Files:**
- Modify: `src/components/music/MusicSearchSheet.tsx`

- [ ] **Step 1: Add history section**

Import `useMusicStore` history and actions. Show history above Quick Picks:

```tsx
const history = useMusicStore((s) => s.history)
const removeFromHistory = useMusicStore((s) => s.removeFromHistory)
```

Add history section:
```tsx
{history.length > 0 && (
  <div className="mt-6">
    <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
      Recently Played
    </p>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {history.slice(0, 8).map((track) => (
        <div key={track.videoId} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <img
            src={`https://img.youtube.com/vi/${track.videoId}/mqdefault.jpg`}
            alt={track.title}
            className="h-12 w-16 rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{track.title}</p>
            <p className="truncate text-xs text-muted-foreground">{track.channel}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => handleSelect(track)} className="p-1 text-primary hover:text-primary/80">
              <Play className="h-4 w-4" />
            </button>
            <button onClick={() => removeFromHistory(track.videoId)} className="p-1 text-muted-foreground hover:text-destructive">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

- [ ] **Step 2: Add playlists section**

Import playlist actions. Add playlist creation and display:

```tsx
const playlists = useMusicStore((s) => s.playlists)
const createPlaylist = useMusicStore((s) => s.createPlaylist)
const deletePlaylist = useMusicStore((s) => s.deletePlaylist)
const playPlaylist = useMusicStore((s) => s.playPlaylist)
const [newPlaylistName, setNewPlaylistName] = useState('')
```

Add playlists section after history:
```tsx
<div className="mt-6">
  <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
    Playlists
  </p>
  <div className="flex gap-2 mb-3">
    <Input
      placeholder="Nama playlist baru..."
      value={newPlaylistName}
      onChange={(e) => setNewPlaylistName(e.target.value)}
      className="h-8 text-sm"
    />
    <Button
      size="sm"
      onClick={() => {
        if (newPlaylistName.trim()) {
          createPlaylist(newPlaylistName.trim())
          setNewPlaylistName('')
        }
      }}
      disabled={!newPlaylistName.trim()}
      className="h-8 px-3"
    >
      Buat
    </Button>
  </div>
  {playlists.map((playlist) => (
    <div key={playlist.id} className="mb-2 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">{playlist.name}</p>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{playlist.tracks.length} lagu</span>
          {playlist.tracks.length > 0 && (
            <button onClick={() => playPlaylist(playlist.id)} className="p-1 text-primary hover:text-primary/80">
              <Play className="h-3.5 w-3.5" />
            </button>
          )}
          <button onClick={() => deletePlaylist(playlist.id)} className="p-1 text-muted-foreground hover:text-destructive">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

---

### Task 6: Fix Music Button Readability

**Files:**
- Modify: `src/components/music/MusicPlayerBar.tsx`

- [ ] **Step 1: Update "Ganti" button styling**

Change the button from `variant="outline"` to explicit styling that works in both modes:

```tsx
<Button
  size="sm"
  onClick={onOpenSearch}
  className="h-7 px-2.5 text-[11px] font-mono bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
>
  <Music className="h-3 w-3 mr-1" />
  Ganti
</Button>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

---

### Task 7: Visual Verification

- [ ] **Step 1: Test timer click-outside-to-close**

Open app, click timer button to expand, click outside → should close.

- [ ] **Step 2: Test timer hour+minute input**

Set custom time with hours and minutes, verify countdown starts correctly.

- [ ] **Step 3: Test timer hint tooltip**

Clear localStorage `wazheefa-timer-hint-seen`, reload → tooltip should appear and auto-dismiss.

- [ ] **Step 4: Test music history**

Play a track, open search sheet → should show in Recently Played. Click X → should remove.

- [ ] **Step 5: Test music playlists**

Create playlist, add tracks, play playlist, delete playlist.

- [ ] **Step 6: Test music button in light and dark mode**

Switch themes → "Ganti" button should be readable in both.

- [ ] **Step 7: Run final verification**

```bash
npx tsc --noEmit && npm run lint
```

Expected: both pass.
