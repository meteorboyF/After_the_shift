import { useEffect, useRef, useState } from 'react'

/** Play a stored Blob. One player per row; stops when unmounted. */
export function useAudio(blob) {
  const [playing, setPlaying] = useState(false)
  const audio = useRef(null)
  const url = useRef(null)

  useEffect(() => {
    return () => {
      audio.current?.pause()
      if (url.current) URL.revokeObjectURL(url.current)
    }
  }, [])

  const toggle = () => {
    if (!blob) return
    if (!audio.current) {
      url.current = URL.createObjectURL(blob)
      audio.current = new Audio(url.current)
      audio.current.onended = () => setPlaying(false)
    }
    if (playing) {
      audio.current.pause()
      setPlaying(false)
    } else {
      audio.current.currentTime = 0
      audio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }
  return { playing, toggle, available: Boolean(blob) }
}
