import { useState, useCallback } from 'react'
import { Volume2, VolumeX, Music, ChevronUp, ChevronDown, Shuffle, Repeat, Repeat1, SkipBack, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMusicStore } from '@/store/musicStore'
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer'
import { cn, formatTime } from '@/lib/utils'

interface MusicPlayerBarProps {
  onOpenSearch: () => void
}

export function MusicPlayerBar({ onOpenSearch }: MusicPlayerBarProps) {
  const currentTrack = useMusicStore((s) => s.currentTrack)
  const isPlaying = useMusicStore((s) => s.isPlaying)
  const volume = useMusicStore((s) => s.volume)
  const isPlayerOpen = useMusicStore((s) => s.isPlayerOpen)
  const isShuffle = useMusicStore((s) => s.isShuffle)
  const repeatMode = useMusicStore((s) => s.repeatMode)
  const setVolume = useMusicStore((s) => s.setVolume)
  const togglePlayer = useMusicStore((s) => s.togglePlayer)
  const toggleShuffle = useMusicStore((s) => s.toggleShuffle)
  const cycleRepeat = useMusicStore((s) => s.cycleRepeat)
  const nextTrack = useMusicStore((s) => s.nextTrack)
  const prevTrack = useMusicStore((s) => s.prevTrack)
  const { containerRef, togglePlayPause, seekTo, currentTime, duration } = useYouTubePlayer()
  const [isDragging, setIsDragging] = useState(false)
  const [dragTime, setDragTime] = useState(0)

  const handleSeekStart = useCallback(() => {
    setIsDragging(true)
    setDragTime(currentTime)
  }, [currentTime])

  const handleSeekChange = useCallback((value: number) => {
    setDragTime(value)
  }, [])

  const handleSeekEnd = useCallback(() => {
    seekTo(dragTime)
    setIsDragging(false)
  }, [seekTo, dragTime])

  const displayTime = isDragging ? dragTime : currentTime
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0

  if (!currentTrack) return null

  return (
    <div data-music-player-bar className="fixed bottom-0 left-0 right-0 z-50 animate-card-in pb-safe">
      <div ref={containerRef} style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, top: -9999, left: -9999 }} />

      {!isPlayerOpen && (
        <div className="border-t border-border/60 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-3 sm:gap-3 sm:px-4">
            <button
              onClick={togglePlayer}
              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl py-1 text-left transition-colors hover:bg-accent/40 sm:gap-3"
            >
              <div className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10',
                isPlaying && 'animate-pulse'
              )}>
                <Music className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-medium leading-tight">{currentTrack.title}</p>
                <p className="truncate text-xs text-muted-foreground">{currentTrack.channel}</p>
              </div>
            </button>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTrack}
                className="hidden h-10 w-10 rounded-xl sm:inline-flex"
                aria-label="Previous track"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                className="h-10 w-10 rounded-xl"
                aria-label={isPlaying ? 'Pause' : 'Play'}
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
                onClick={nextTrack}
                className="hidden h-10 w-10 rounded-xl sm:inline-flex"
                aria-label="Next track"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayer}
                className="h-10 w-10 rounded-xl"
                aria-label="Expand player"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {isPlayerOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-3 py-3 sm:px-4 sm:py-3.5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10',
                  isPlaying && 'animate-pulse'
                )}>
                  <Music className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{currentTrack.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{currentTrack.channel}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayer}
                className="h-9 w-9 shrink-0 rounded-xl"
                aria-label="Collapse player"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-3 flex items-center gap-2.5">
              <span className="w-9 shrink-0 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
                {formatTime(displayTime)}
              </span>
              <div className="relative min-w-0 flex-1 py-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={displayTime}
                  onMouseDown={handleSeekStart}
                  onTouchStart={handleSeekStart}
                  onChange={(e) => handleSeekChange(Number(e.target.value))}
                  onMouseUp={handleSeekEnd}
                  onTouchEnd={handleSeekEnd}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Seek"
                />
              </div>
              <span className="w-9 shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-center gap-1 sm:justify-start">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleShuffle}
                  className={cn('h-9 w-9 rounded-xl', isShuffle && 'text-primary')}
                  aria-label="Shuffle"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevTrack}
                  className="h-10 w-10 rounded-xl"
                  aria-label="Previous track"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayPause}
                  className="h-11 w-11 rounded-xl bg-primary/10 text-primary hover:bg-primary/15"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextTrack}
                  className="h-10 w-10 rounded-xl"
                  aria-label="Next track"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cycleRepeat}
                  className={cn('h-9 w-9 rounded-xl', repeatMode !== 'off' && 'text-primary')}
                  aria-label="Repeat"
                >
                  {repeatMode === 'one' ? (
                    <Repeat1 className="h-3.5 w-3.5" />
                  ) : (
                    <Repeat className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setVolume(volume === 0 ? 50 : 0)}
                    className="h-9 w-9 rounded-xl"
                    aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                  >
                    {volume === 0 ? (
                      <VolumeX className="h-3.5 w-3.5" />
                    ) : (
                      <Volume2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-border accent-primary sm:w-24"
                    aria-label="Volume"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={onOpenSearch}
                  className="h-9 shrink-0 rounded-xl bg-primary px-3 font-mono text-[11px] text-primary-foreground hover:bg-primary/90"
                >
                  <Music className="mr-1.5 h-3 w-3" />
                  Change
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
