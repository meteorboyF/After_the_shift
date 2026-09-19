import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenShell from '../../components/ScreenShell.jsx'
import BigButton from '../../components/BigButton.jsx'
import VoiceButton from '../../components/VoiceButton.jsx'
import Waveform from '../../components/Waveform.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { useRelief } from '../../store/relief.js'
import { startRecording } from '../../lib/recorder.js'
import { startTranscription } from '../../lib/speech.js'
import { blobToBase64 } from '../../lib/audio.js'
import { tapFeedback } from '../../lib/haptics.js'

/**
 * Screen 3B.
 *
 * Attaching a reason is optional and visibly *not* expected: the mic is smaller
 * than the one on home, and the filled primary is "send without a reason",
 * sitting above the outline option to attach one. A guard who wants rest should
 * not have to build a case for it.
 *
 * There is no text field, here or anywhere.
 */
export default function ReasonScreen() {
  const navigate = useNavigate()
  const { t } = useT()
  const draft = useRelief((s) => s.draft)
  const setDraft = useRelief((s) => s.setDraft)

  const [recording, setRecording] = useState(false)
  const [levels, setLevels] = useState([])
  // Kept in state, not read off the ref during render — a ref read there does
  // not re-render when the mic turns out to be unavailable.
  const [micAvailable, setMicAvailable] = useState(true)
  const recorderRef = useRef(null)
  const transcriberRef = useRef(null)
  const stoppedRef = useRef(false)

  // A refresh onto this screen has no request in progress; start over rather
  // than ask for a reason for nothing.
  useEffect(() => {
    if (!draft) navigate('/relief', { replace: true })
  }, [draft, navigate])

  useEffect(
    () => () => {
      if (!stoppedRef.current) {
        recorderRef.current?.cancel()
        transcriberRef.current?.stop()
      }
    },
    [],
  )

  if (!draft) return null

  const startReason = async () => {
    tapFeedback()
    setRecording(true)
    try {
      recorderRef.current = await startRecording({ onLevels: setLevels })
      setMicAvailable(true)
    } catch {
      // No mic is not a blocker: the request still goes, just without a reason.
      recorderRef.current = null
      setMicAvailable(false)
    }
    transcriberRef.current = startTranscription()
  }

  const finishReason = async () => {
    tapFeedback()
    stoppedRef.current = true

    const transcript = transcriberRef.current?.stop() || null
    let audio = null
    if (recorderRef.current) {
      const blob = await recorderRef.current.stop()
      if (blob.size > 0) audio = await blobToBase64(blob)
    }

    setDraft({ ...draft, reasonAudioBase64: audio, reasonTranscript: transcript })
    navigate('/relief/preview')
  }

  const sendWithout = () => {
    stoppedRef.current = true
    recorderRef.current?.cancel()
    transcriberRef.current?.stop()
    setDraft({ ...draft, reasonAudioBase64: null, reasonTranscript: null })
    navigate('/relief/preview')
  }

  return (
    <ScreenShell
      guard="day_post"
      guardOpacity={0.16}
      onBack={() => navigate('/relief')}
      backLabel={t('common.back')}
    >
      <h1 className="mt-2 text-label-lg font-semibold text-cream">{t('relief.reasonHeading')}</h1>

      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        {recording ? (
          <>
            <Waveform levels={levels} idle={!micAvailable} />
            <p className="text-label text-cream">{t('relief.recording')}</p>
          </>
        ) : (
          <div className="flex h-28 items-center justify-center text-amber/45">
            <Icon name="mic" size={56} strokeWidth={1.4} />
          </div>
        )}
      </div>

      {recording ? (
        <BigButton onClick={finishReason}>{t('record.done')}</BigButton>
      ) : (
        <div className="flex flex-col gap-3">
          {/* The private choice is the primary one, and it is on top. */}
          <BigButton onClick={sendWithout}>{t('relief.sendWithoutReason')}</BigButton>

          <div className="flex justify-center">
            <VoiceButton size={96} label={t('relief.attachReason')} onClick={startReason} />
          </div>
        </div>
      )}
    </ScreenShell>
  )
}
