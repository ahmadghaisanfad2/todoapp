import { useState, useEffect, useRef, useCallback } from 'react'

type TimerState = 'idle' | 'running' | 'paused' | 'complete'

interface UseTimerReturn {
  state: TimerState
  timeRemaining: number
  totalTime: number
  progress: number
  start: (seconds: number) => void
  pause: () => void
  resume: () => void
  stop: () => void
  dismiss: () => void
  isMuted: boolean
  toggleMute: () => void
}

export function useTimer(): UseTimerReturn {
  const [state, setState] = useState<TimerState>('idle')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const chimeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const progress = totalTime > 0 ? timeRemaining / totalTime : 0

  const playChime = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      const ctx = audioContextRef.current
      const now = ctx.currentTime

      const tones = [523.25, 659.25, 783.99] // C5, E5, G5
      tones.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.3, now + i * 0.3)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.8)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.3)
        osc.stop(now + i * 0.3 + 0.8)
      })
    } catch {
      // Audio not available
    }
  }, [])

  const startChimeInterval = useCallback(() => {
    if (chimeIntervalRef.current) clearInterval(chimeIntervalRef.current)
    chimeIntervalRef.current = setInterval(() => {
      playChime()
    }, 3000)
  }, [playChime])

  const stopChimeInterval = useCallback(() => {
    if (chimeIntervalRef.current) {
      clearInterval(chimeIntervalRef.current)
      chimeIntervalRef.current = null
    }
  }, [])

  const showNotification = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Wazheefa', {
        body: "Time's up! Great work on your focus session.",
        icon: '/favicon.svg',
      })
    }
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (state === 'running' && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setState('complete')
            playChime()
            startChimeInterval()
            showNotification()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state, timeRemaining, playChime, startChimeInterval, showNotification])

  const start = useCallback((seconds: number) => {
    requestNotificationPermission()
    setTotalTime(seconds)
    setTimeRemaining(seconds)
    setState('running')
  }, [requestNotificationPermission])

  const pause = useCallback(() => {
    setState('paused')
  }, [])

  const resume = useCallback(() => {
    setState('running')
  }, [])

  const stop = useCallback(() => {
    setState('idle')
    setTimeRemaining(0)
    setTotalTime(0)
    stopChimeInterval()
  }, [stopChimeInterval])

  const dismiss = useCallback(() => {
    setState('idle')
    setTimeRemaining(0)
    setTotalTime(0)
    stopChimeInterval()
  }, [stopChimeInterval])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  return {
    state,
    timeRemaining,
    totalTime,
    progress,
    start,
    pause,
    resume,
    stop,
    dismiss,
    isMuted,
    toggleMute,
  }
}
