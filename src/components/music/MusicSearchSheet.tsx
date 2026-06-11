import { useState, useCallback } from 'react'
import { Search, Play } from 'lucide-react'
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
  const setTrack = useMusicStore((s) => s.setTrack)

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
          setSearchResult({
            videoId,
            title: info.title,
            channel: info.channel,
          })
        } else {
          setError('Could not find video. Check the URL.')
        }
      } catch {
        setError('Failed to fetch video info.')
      } finally {
        setIsSearching(false)
      }
    } else {
      setError('Paste a YouTube URL or video ID')
    }
  }, [query])

  const handleSelect = (track: MusicTrack) => {
    setTrack(track)
    onOpenChange(false)
    setQuery('')
    setSearchResult(null)
    setError('')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Find Music</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Paste YouTube URL or video ID..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setError('')
                  setSearchResult(null)
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
              {isSearching ? '...' : 'Load'}
            </Button>
          </div>
          {error && (
            <p className="mt-2 text-xs text-destructive">{error}</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Works with any YouTube video URL
          </p>
        </div>

        {searchResult && (
          <div className="mt-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Found
            </p>
            <button
              onClick={() => handleSelect(searchResult)}
              className="flex w-full items-center gap-3 rounded-lg border border-primary bg-primary/5 p-3 text-left transition-colors hover:bg-primary/10"
            >
              <img
                src={`https://img.youtube.com/vi/${searchResult.videoId}/mqdefault.jpg`}
                alt={searchResult.title}
                className="h-12 w-16 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{searchResult.title}</p>
                <p className="truncate text-xs text-muted-foreground">{searchResult.channel}</p>
              </div>
              <Play className="h-4 w-4 shrink-0 text-primary" />
            </button>
          </div>
        )}

        <div className="mt-6">
          <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Quick Picks
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {filteredPresets.map((preset) => (
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
          {filteredPresets.length === 0 && !searchResult && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No tracks found
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
