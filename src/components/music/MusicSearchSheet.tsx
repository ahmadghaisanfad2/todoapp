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
