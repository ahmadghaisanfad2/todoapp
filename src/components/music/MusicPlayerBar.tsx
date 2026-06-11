import { useState, useCallback } from 'react'
import { Volume2, VolumeX, Music, ChevronUp, ChevronDown, Shuffle, Repeat, Repeat1, SkipBack, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMusicStore } from '@/store/musicStore'
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer'
import { cn } from '@/lib/utils'

interface MusicPlayerBarProps {
  onOpenSearch: () => void
}

function formatTime(seconds: number): string {
  if (!seconds || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function MusicPlayerBar({ onOpenSearch }: MusicPlayerBarProps) {
  const { 
    currentTrack, isPlaying, volume, isPlayerOpen, 
    isShuffle, repeatMode,
    setVolume, togglePlayer, toggleShuffle, cycleRepeat, nextTrack, prevTrack 
  } = useMusicStore()
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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div ref={containerRef} style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, top: -9999, left: -9999 }} />

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
                onClick={prevTrack}
                className="h-9 w-9"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
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
                onClick={nextTrack}
                className="h-9 w-9"
              >
                <SkipForward className="h-4 w-4" />
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
              <span className="w-10 text-right text-xs font-mono text-muted-foreground">
                {formatTime(displayTime)}
              </span>
              
              <div className="flex-1 relative">
                <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-100"
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
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              
              <span className="w-10 text-xs font-mono text-muted-foreground">
                {formatTime(duration)}
              </span>

              <div className="flex items-center gap-1 ml-2">
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
                  className="w-20 h-1.5 cursor-pointer appearance-none rounded-full bg-border accent-primary"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <Button
                variant={isShuffle ? 'default' : 'ghost'}
                size="icon"
                onClick={toggleShuffle}
                className={cn('h-9 w-9', isShuffle && 'text-primary')}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTrack}
                className="h-10 w-10"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTrack}
                className="h-10 w-10"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button
                variant={repeatMode !== 'off' ? 'default' : 'ghost'}
                size="icon"
                onClick={cycleRepeat}
                className={cn('h-9 w-9', repeatMode !== 'off' && 'text-primary')}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="h-4 w-4" />
                ) : (
                  <Repeat className="h-4 w-4" />
                )}
              </Button>
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
