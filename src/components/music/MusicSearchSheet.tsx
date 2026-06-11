import { useState, useCallback } from 'react'
import { Search, Play, X, Plus, ListPlus } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMusicStore } from '@/store/musicStore'
import { LOFI_PRESETS } from '@/lib/musicPresets'
import type { MusicTrack } from '@/store/musicStore'

interface MusicSearchSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

async function getVideoInfo(videoId: string): Promise<{ title: string; channel: string; thumbnail: string } | null> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
    if (!res.ok) return null
    const data = await res.json()
    return {
      title: data.title,
      channel: data.author_name,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    }
  } catch {
    return null
  }
}

export function MusicSearchSheet({ open, onOpenChange }: MusicSearchSheetProps) {
  const [query, setQuery] = useState('')
  const [searchResult, setSearchResult] = useState<MusicTrack | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [addToPlaylistFor, setAddToPlaylistFor] = useState<string | null>(null)

  const setTrack = useMusicStore((s) => s.setTrack)
  const history = useMusicStore((s) => s.history)
  const removeFromHistory = useMusicStore((s) => s.removeFromHistory)
  const playlists = useMusicStore((s) => s.playlists)
  const createPlaylist = useMusicStore((s) => s.createPlaylist)
  const deletePlaylist = useMusicStore((s) => s.deletePlaylist)
  const playPlaylist = useMusicStore((s) => s.playPlaylist)
  const addTrackToPlaylist = useMusicStore((s) => s.addTrackToPlaylist)

  const filteredPresets = LOFI_PRESETS.filter((preset) =>
    !query.trim() ||
    preset.title.toLowerCase().includes(query.toLowerCase()) ||
    preset.channel.toLowerCase().includes(query.toLowerCase())
  )

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return
    const videoId = extractVideoId(query.trim())
    if (videoId) {
      setIsSearching(true)
      setError('')
      try {
        const info = await getVideoInfo(videoId)
        if (info) {
          setSearchResult({ videoId, title: info.title, channel: info.channel })
        } else {
          setError('Video tidak ditemukan. Cek URL.')
        }
      } catch {
        setError('Gagal mengambil info video.')
      } finally {
        setIsSearching(false)
      }
    } else {
      setError('Tempel URL YouTube atau video ID')
    }
  }, [query])

  const handleSelect = (track: MusicTrack) => {
    setTrack(track)
    onOpenChange(false)
    setQuery('')
    setSearchResult(null)
    setError('')
  }

  const handleAddToPlaylist = (playlistId: string, track: MusicTrack) => {
    addTrackToPlaylist(playlistId, track)
    setAddToPlaylistFor(null)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Cari Musik</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tempel URL YouTube atau video ID..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setError(''); setSearchResult(null) }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
              {isSearching ? '...' : 'Load'}
            </Button>
          </div>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          <p className="mt-2 text-xs text-muted-foreground">Mendukung URL video YouTube apa pun</p>
        </div>

        {searchResult && (
          <div className="mt-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Ditemukan</p>
            <div className="relative flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-3">
              <img src={`https://img.youtube.com/vi/${searchResult.videoId}/mqdefault.jpg`} alt={searchResult.title} className="h-12 w-16 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{searchResult.title}</p>
                <p className="truncate text-xs text-muted-foreground">{searchResult.channel}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {playlists.length > 0 && (
                  <button onClick={() => setAddToPlaylistFor(addToPlaylistFor === searchResult.videoId ? null : searchResult.videoId)} className="p-1 text-muted-foreground hover:text-primary"><Plus className="h-4 w-4" /></button>
                )}
                <button onClick={() => handleSelect(searchResult)} className="p-1 text-primary hover:text-primary/80"><Play className="h-4 w-4" /></button>
              </div>
              {addToPlaylistFor === searchResult.videoId && playlists.length > 0 && (
                <div className="absolute right-0 top-full z-10 mt-1 min-w-[160px] rounded-lg border border-border bg-card p-1 shadow-lg">
                  {playlists.map((pl) => (
                    <button key={pl.id} onClick={() => handleAddToPlaylist(pl.id, searchResult)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent">
                      <ListPlus className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{pl.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Terakhir Diputar</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {history.slice(0, 8).map((track) => (
                <div key={track.videoId} className="relative flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <img src={`https://img.youtube.com/vi/${track.videoId}/mqdefault.jpg`} alt={track.title} className="h-12 w-16 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{track.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{track.channel}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {playlists.length > 0 && (
                      <button onClick={() => setAddToPlaylistFor(addToPlaylistFor === track.videoId ? null : track.videoId)} className="p-1 text-muted-foreground hover:text-primary"><Plus className="h-4 w-4" /></button>
                    )}
                    <button onClick={() => handleSelect(track)} className="p-1 text-primary hover:text-primary/80"><Play className="h-4 w-4" /></button>
                    <button onClick={() => removeFromHistory(track.videoId)} className="p-1 text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                  </div>
                  {addToPlaylistFor === track.videoId && playlists.length > 0 && (
                    <div className="absolute right-0 top-full z-10 mt-1 min-w-[160px] rounded-lg border border-border bg-card p-1 shadow-lg">
                      {playlists.map((pl) => (
                        <button key={pl.id} onClick={() => handleAddToPlaylist(pl.id, track)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent">
                          <ListPlus className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="truncate">{pl.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Playlist</p>
          <div className="flex gap-2 mb-3">
            <Input placeholder="Nama playlist baru..." value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="h-8 text-sm" />
            <Button size="sm" onClick={() => { if (newPlaylistName.trim()) { createPlaylist(newPlaylistName.trim()); setNewPlaylistName('') } }} disabled={!newPlaylistName.trim()} className="h-8 px-3">Buat</Button>
          </div>
          {playlists.map((pl) => (
            <div key={pl.id} className="mb-2 rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{pl.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{pl.tracks.length} lagu</span>
                  {pl.tracks.length > 0 && (
                    <button onClick={() => playPlaylist(pl.id)} className="p-1 text-primary hover:text-primary/80"><Play className="h-3.5 w-3.5" /></button>
                  )}
                  <button onClick={() => deletePlaylist(pl.id)} className="p-1 text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Picks</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {filteredPresets.map((preset) => (
              <div key={preset.videoId} className="relative flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary hover:bg-primary/5">
                <img src={preset.thumbnail} alt={preset.title} className="h-12 w-16 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{preset.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{preset.channel}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {playlists.length > 0 && (
                    <button onClick={() => setAddToPlaylistFor(addToPlaylistFor === preset.videoId ? null : preset.videoId)} className="p-1 text-muted-foreground hover:text-primary"><Plus className="h-4 w-4" /></button>
                  )}
                  <button onClick={() => handleSelect(preset)} className="p-1 text-primary hover:text-primary/80"><Play className="h-4 w-4" /></button>
                </div>
                {addToPlaylistFor === preset.videoId && playlists.length > 0 && (
                  <div className="absolute right-0 top-full z-10 mt-1 min-w-[160px] rounded-lg border border-border bg-card p-1 shadow-lg">
                    {playlists.map((pl) => (
                      <button key={pl.id} onClick={() => handleAddToPlaylist(pl.id, preset)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent">
                        <ListPlus className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate">{pl.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {filteredPresets.length === 0 && !searchResult && (
            <p className="text-center text-sm text-muted-foreground py-8">Tidak ada lagu ditemukan</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
