import { useEffect, useRef, useCallback } from 'react'
import { useMusicStore } from '@/store/musicStore'

export function useYouTubePlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { currentTrack, isPlaying, volume, setIsPlaying } = useMusicStore()

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
    iframe.src = `https://www.youtube.com/embed/${currentTrack.videoId}?enablejsapi=1&origin=${window.location.origin}`
  }, [currentTrack])

  useEffect(() => {
    if (!iframeRef.current) return
    postMessage('setVolume', [volume])
  }, [volume, postMessage])

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
