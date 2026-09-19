import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import ScreenShell from '../../components/ScreenShell.jsx'
import BigButton from '../../components/BigButton.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { EASE_CALM } from '../../lib/motion.js'

/**
 * Screen 2D.
 *
 * No "do you feel better now?" — that would turn the exercise into an
 * assessment, and there is no scale, score or follow-up question anywhere on
 * this screen.
 *
 * The grey line is a factual claim, and it holds: GroundingCompletion has no
 * user column and stores a date, not a timestamp. Nothing written for Task 2
 * can be tied back to the person who did it.
 *
 * Both buttons are outline and the same size. Going again and leaving are
 * equally fine.
 */
export default function GroundingDoneScreen() {
  const navigate = useNavigate()
  const { t } = useT()
  const reduced = useReducedMotion()

  return (
    <ScreenShell guard="resting" guardOpacity={0.22}>
      <div className="flex flex-1 flex-col items-center justify-center gap-7 text-center">
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE_CALM }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-ok/15 text-ok"
        >
          <Icon name="tick" size={44} strokeWidth={2.2} />
        </motion.div>

        <h1 className="text-display font-semibold text-cream">{t('grounding.done')}</h1>

        <p className="text-base text-muted">{t('grounding.notRecorded')}</p>
      </div>

      <div className="flex flex-col gap-3">
        <BigButton variant="outline" onClick={() => navigate('/grounding', { replace: true })}>
          {t('grounding.again')}
        </BigButton>
        <BigButton variant="outline" onClick={() => navigate('/', { replace: true })}>
          {t('grounding.exit')}
        </BigButton>
      </div>
    </ScreenShell>
  )
}
