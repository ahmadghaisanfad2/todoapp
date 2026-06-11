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
      <iframe
        ref={iframeRef}
        className="pointer-events-none absolute opacity-0"
        width="0"
        height="0"
        allow="autoplay; encrypted-media"
        title="Music Player"
      />

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
