import { Pause, Play } from 'lucide-react'
import { useAudio } from '../lib/useAudio.js'
import { useLongPress } from '../lib/useLongPress.js'

/** 64px round play/pause for a stored recording. */
export default function PlayButton({ blob, label, pauseLabel }) {
  const { playing, toggle } = useAudio(blob)
  const press = useLongPress(playing ? pauseLabel : label)
  const Icon = playing ? Pause : Play
  return (
    <button
      type="button"
      onClick={toggle}
      {...press}
      aria-label={playing ? pauseLabel : label}
      aria-pressed={playing}
      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ease-calm
        ${playing ? 'bg-amber text-ink shadow-glow' : 'border-2 border-amber/50 text-amber-glow hover:border-amber'}`}
    >
      <Icon size={26} strokeWidth={2} aria-hidden="true" className={playing ? '' : 'ml-1'} />
    </button>
  )
}
