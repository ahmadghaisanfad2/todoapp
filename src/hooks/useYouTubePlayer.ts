import { useEffect, useRef, useCallback, useState } from 'react'
import { useMusicStore } from '@/store/musicStore'
import type { MusicTrack } from '@/store/musicStore'

interface YouTubePlayerInstance {
  playVideo(): void
  pauseVideo(): void
  loadVideoById(videoId: string): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  setVolume(volume: number): void
  getCurrentTime(): number
  getDuration(): number
  destroy(): void
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

const YOUTUBE_API_SCRIPT_ID = 'wazheefa-youtube-api'

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

  // Refs mirror the latest store values so the YouTube callbacks (which are
  // created once and outlive renders) never capture stale state. Synced in
  // effects — writing refs during render is flagged by react-hooks/refs.
  const currentTrackRef = useRef(currentTrack)
  const volumeRef = useRef(volume)
  useEffect(() => {
    currentTrackRef.current = currentTrack
  }, [currentTrack])
  useEffect(() => {
    volumeRef.current = volume
  }, [volume])

  const endedRef = useRef(false)
  const [playerState, setPlayerState] = useState<YouTubePlayerState>({
    currentTime: 0,
    duration: 0,
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      const player = playerRef.current
      if (!player) return
      const currentTime = player.getCurrentTime()
      const duration = player.getDuration()
      if (typeof currentTime === 'number') {
        setPlayerState((prev) => ({ ...prev, currentTime }))
      }
      if (typeof duration === 'number' && duration > 0) {
        setPlayerState((prev) => ({ ...prev, duration }))
      }
    }, 250)
  }, [])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const createPlayer = useCallback(
    (YT: YouTubeWindowAPI, track: MusicTrack) => {
      const container = containerRef.current
      if (!container) return

      playerRef.current = new YT.Player(container, {
        height: '1',
        width: '1',
        videoId: track.videoId,
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
            playerRef.current?.setVolume(volumeRef.current)
            if (!useMusicStore.getState().isPlaying) {
              setIsPlaying(false)
            }
            startPolling()
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
    },
    [setIsPlaying, startPolling, stopPolling]
  )

  // Load the current track, creating the player on first use. Handles three
  // paths: player exists (just switch video), API already loaded (remount),
  // and API still loading (wire the global callback before injecting script).
  useEffect(() => {
    const track = currentTrackRef.current
    if (!track) return

    if (playerRef.current) {
      endedRef.current = false
      playerRef.current.loadVideoById(track.videoId)
      return
    }

    const YT = getYouTubeAPI()
    if (YT?.Player) {
      createPlayer(YT, track)
      return
    }

    const windowWithAPI = window as unknown as { onYouTubeIframeAPIReady?: () => void }
    windowWithAPI.onYouTubeIframeAPIReady = () => {
      const api = getYouTubeAPI()
      const nextTrack = currentTrackRef.current
      if (!api || !nextTrack) return
      createPlayer(api, nextTrack)
    }

    if (!document.getElementById(YOUTUBE_API_SCRIPT_ID)) {
      const tag = document.createElement('script')
      tag.id = YOUTUBE_API_SCRIPT_ID
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  }, [currentTrack, createPlayer])

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

  // Unmount cleanup: stop polling, destroy the player, drop our global hook.
  useEffect(() => {
    return () => {
      stopPolling()
      playerRef.current?.destroy()
      playerRef.current = null
      const windowWithAPI = window as unknown as { onYouTubeIframeAPIReady?: () => void }
      windowWithAPI.onYouTubeIframeAPIReady = undefined
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
