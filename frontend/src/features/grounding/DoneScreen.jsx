import { useLocation, useNavigate } from 'react-router-dom'
import { EyeOff, LogOut, RotateCcw } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Button from '../../components/Button.jsx'
import Heading from '../../components/Heading.jsx'
import { useT } from '../../i18n/index.js'

/**
 * 2D. Two equal choices. Deliberately no "do you feel better now?" — that
 * would turn grounding into assessment. And the grey line is literally true:
 * nothing about this session was stored, only an anonymous count.
 */
export default function DoneScreen() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { t } = useT()
  const from = state?.from ?? '/'
  const type = state?.type ?? 'breathing'

  return (
    <Screen zone="mine" topLeft={<span />} lamp={0.9}>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <Heading size="hero">{t('grounding.done')}</Heading>
        <p className="flex items-center gap-2 text-body text-sand">
          <EyeOff size={20} strokeWidth={1.75} className="text-zone-mine" aria-hidden="true" />
          {t('grounding.notRecorded')}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          variant="secondary"
          icon={RotateCcw}
          label={t('grounding.again')}
          onClick={() => navigate(`/grounding/${type}`, { replace: true, state: { from } })}
        />
        <Button variant="secondary" icon={LogOut} label={t('grounding.exit')} onClick={() => navigate(from, { replace: true })} />
      </div>
    </Screen>
  )
}
