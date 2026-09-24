import { Droplets, Footprints, Wind } from 'lucide-react'

/**
 * The three options are the guards' OWN coping strategies from the interviews
 * (Finding 3: coping is physical and passive). Not meditation-app content.
 */
export const EXERCISES = {
  water: { key: 'water', icon: Droplets, minutes: 1, seconds: 60 },
  breathing: { key: 'breathing', icon: Wind, minutes: 2, seconds: 120 },
  walk: { key: 'walk', icon: Footprints, minutes: 3, seconds: 180 },
}
export const ORDER = ['water', 'breathing', 'walk']
