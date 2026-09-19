import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenShell from '../../components/ScreenShell.jsx'
import BigButton from '../../components/BigButton.jsx'
import Waveform from '../../components/Waveform.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { useCheckins } from '../../store/checkins.js'
import { startRecording } from '../../lib/recorder.js'
import { startTranscription } from '../../lib/speech.js'
import { blobToBase64, formatElapsed } from '../../lib/audio.js'
import { shiftTypeForNow } from '../../lib/time.js'
import { tapFeedback } from '../../lib/haptics.js'

/**
 * Screen 1B.
 *
 * Near-empty on purpose. There is no prompt, no question, no suggestion chip
 * and nothing resembling a mood control — this screen listens, it does not ask.
 * Recording begins on arrival, so reaching it is a single tap from home.
 */
export default function RecordScreen() {
  const navigate = useNavigate()
  const { t, n } = useT()
  const setPending = useCheckins((s) => s.setPending)

  const [levels, setLevels] = useState([])
  const [elapsed, setElapsed] = useState(0)
  const [micFailed, setMicFailed] = useState(false)

  const recorderRef = useRef(null)
  const transcriberRef = useRef(null)
  const transcriptRef = useRef('')
  // Set on mount rather than at render time — calling Date.now() during render
  // makes the value unstable across re-renders.
  const startedAtRef = useRef(0)
  const finishedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const begin = async () => {
      try {
        const handle = await startRecording({
          onLevels: (next) => {
            if (!cancelled) setLevels(next)
          },
        })
        if (cancelled) {
          handle.cancel()
          return
        }
        recorderRef.current = handle
      } catch {
        // Mic refused or unavailable. The guard is not blocked — the entry can
        // still be kept, just without sound.
        if (!cancelled) setMicFailed(true)
      }

      // Transcription is a bonus. A browser without Bangla recognition simply
      // produces no transcript, and nothing anywhere waits on it.
      transcriberRef.current = startTranscription({
        onText: (text) => {
          transcriptRef.current = text
        },
      })
    }

    begin()
    startedAtRef.current = Date.now()
    const timer = setInterval(() => {
      setElapsed((Date.now() - startedAtRef.current) / 1000)
    }, 200)

    return () => {
      cancelled = true
      clearInterval(timer)
      if (!finishedRef.current) {
        recorderRef.current?.cancel()
        transcriberRef.current?.stop()
      }
    }
  }, [])

  const finish = useCallback(async () => {
    if (finishedRef.current) return
    finishedRef.current = true
    tapFeedback()

    const durationSec = startedAtRef.current ? (Date.now() - startedAtRef.current) / 1000 : 0
    const transcript = transcriberRef.current?.stop() || transcriptRef.current || null

    let audioBase64 = null
    let mimeType = 'audio/webm'
    if (recorderRef.current) {
      mimeType = recorderRef.current.mimeType
      const blob = await recorderRef.current.stop()
      if (blob.size > 0) audioBase64 = await blobToBase64(blob)
    }

    setPending({
      audioBase64,
      mimeType,
      transcript,
      durationSec,
      shiftType: shiftTypeForNow(),
      recordedAt: new Date().toISOString(),
    })

    navigate('/checkin/privacy')
  }, [navigate, setPending])

  const cancel = () => {
    finishedRef.current = true
    recorderRef.current?.cancel()
    transcriberRef.current?.stop()
    navigate('/')
  }

  return (
    <ScreenShell
      guard="night_post"
      guardOpacity={0.18}
      topRight={
        <button
          type="button"
          onClick={cancel}
          aria-label={t('record.cancel')}
          className="tap flex items-center justify-center rounded-2xl px-3 text-muted
            transition-colors duration-200 ease-calm hover:text-cream"
        >
          <Icon name="cross" size={24} />
        </button>
      }
      footer={<BigButton onClick={finish}>{t('record.done')}</BigButton>}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <Waveform levels={levels} idle={micFailed} />

        <div className="flex flex-col items-center gap-2">
          <p className="text-label-lg font-semibold text-cream">{t('record.listening')}</p>
          <p className="text-base tabular-nums text-muted">{formatElapsed(elapsed, n)}</p>
        </div>

        {micFailed && (
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-base text-warn">{t('record.noMic')}</p>
            <p className="text-sm text-muted">{t('record.noMicHint')}</p>
          </div>
        )}
      </div>
    </ScreenShell>
  )
}
