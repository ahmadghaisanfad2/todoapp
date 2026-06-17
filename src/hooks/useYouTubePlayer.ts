import { useEffect, useRef, useCallback, useState } from 'react'
import { useMusicStore } from '@/store/musicStore'

interface YouTubePlayerInstance {
  playVideo(): void
  pauseVideo(): void
  loadVideoById(videoId: string): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  setVolume(volume: number): void
  getCurrentTime(): number
  getDuration(): number
}

interface YouTubePlayerOptions {
  height?: string
  width?: string
  videoId?: string
  playerVars?: Record<string, number>
  events?: {
    onReady?: () => void
    onStateChange?: (event: { data: number }) => void
  }
}

interface YouTubePlayerState {
  currentTime: number
  duration: number
}

interface YouTubeWindowAPI {
  Player: new (element: HTMLElement | string, options: YouTubePlayerOptions) => YouTubePlayerInstance
  PlayerState: { ENDED: 0; PLAYING: 1; PAUSED: 2 }
}

function getYouTubeAPI(): YouTubeWindowAPI | undefined {
  return (window as unknown as { YT?: YouTubeWindowAPI }).YT
}

export function useYouTubePlayer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayerInstance | null>(null)
  const currentTrack = useMusicStore((s) => s.currentTrack)
  const isPlaying = useMusicStore((s) => s.isPlaying)
  const volume = useMusicStore((s) => s.volume)
  const setIsPlaying = useMusicStore((s) => s.setIsPlaying)
  const endedRef = useRef(false)
  const [playerState, setPlayerState] = useState<YouTubePlayerState>({
    currentTime: 0,
    duration: 0,
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (!currentTrack) return
    if (!containerRef.current) return

    if (playerRef.current) {
      endedRef.current = false
      playerRef.current.loadVideoById(currentTrack.videoId)
      return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    ;(window as unknown as { onYouTubeIframeAPIReady?: () => void }).onYouTubeIframeAPIReady = () => {
      if (!containerRef.current) return
      const YT = getYouTubeAPI()
      if (!YT) return
      playerRef.current = new YT.Player(containerRef.current, {
        height: '1',
        width: '1',
        videoId: currentTrack.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            if (playerRef.current) {
              playerRef.current.setVolume(volume)
              const { isPlaying: storePlaying } = useMusicStore.getState()
              if (!storePlaying) {
                setIsPlaying(false)
              }
              startPolling()
            }
          },
          onStateChange: (event: { data: number }) => {
            if (event.data === 0) {
              endedRef.current = true
              stopPolling()
              const { nextTrack, repeatMode } = useMusicStore.getState()
              if (repeatMode !== 'off') {
                nextTrack()
              } else {
                setIsPlaying(false)
              }
            } else if (event.data === 1) {
              startPolling()
            } else if (event.data === 2 || event.data === 3) {
              stopPolling()
            }
          },
        },
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack])

  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime()
        const duration = playerRef.current.getDuration()
        if (typeof currentTime === 'number') {
          setPlayerState((prev) => ({ ...prev, currentTime }))
        }
        if (typeof duration === 'number' && duration > 0) {
          setPlayerState((prev) => ({ ...prev, duration }))
        }
      }
    }, 250)
  }, [])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!playerRef.current) return
    playerRef.current.setVolume(volume)
  }, [volume])

  useEffect(() => {
    if (!playerRef.current || !currentTrack) return
    if (isPlaying) {
      if (endedRef.current) {
        endedRef.current = false
        playerRef.current.seekTo(0, true)
      }
      playerRef.current.playVideo()
      startPolling()
    } else {
      playerRef.current.pauseVideo()
      stopPolling()
    }
  }, [isPlaying, currentTrack, startPolling, stopPolling])

  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  const play = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.playVideo()
    }
    setIsPlaying(true)
  }, [setIsPlaying])

  const pause = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pauseVideo()
    }
    setIsPlaying(false)
  }, [setIsPlaying])

  const togglePlayPause = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true)
    }
  }, [])

  return {
    containerRef,
    play,
    pause,
    togglePlayPause,
    seekTo,
    currentTime: playerState.currentTime,
    duration: playerState.duration,
  }
}
