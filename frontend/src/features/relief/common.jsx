import { ArrowLeftRight, Clock, Umbrella } from 'lucide-react'

export const TYPE_META = {
  REST_HALF_HOUR: { key: 'rest', icon: Clock },
  POST_CHANGE: { key: 'change', icon: ArrowLeftRight },
  SHADE_POST: { key: 'shade', icon: Umbrella },
}

export function ago(date, now, t) {
  const min = Math.max(0, Math.round((now - date) / 60_000))
  if (min < 2) return t('relief.justNow')
  if (min < 60) return t('relief.minAgo', { n: min })
  const h = Math.round(min / 60)
  if (h < 24) return t('relief.hoursAgo', { n: h })
  return t('relief.daysAgo', { n: Math.round(h / 24) })
}

export const STATUS_TONE = {
  PENDING: 'bg-amber/15 text-amber-text',
  ACCEPTED: 'bg-ok/15 text-ok',
  DECLINED: 'bg-warn/15 text-warn', // never red
  WITHDRAWN: 'bg-ink-raised text-sand',
}
