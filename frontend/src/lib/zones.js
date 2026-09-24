import { createStore, get, set } from 'idb-keyval'

/**
 * The three data zones — the organising idea of the whole app.
 *
 * Each zone is a separate IndexedDB database, so the separation is physical,
 * not a filter: code reading the supervisor zone cannot stumble into the guard's
 * own data because it is a different database altogether.
 *
 *   mine  — only the guard, on this phone only. Never synced. No account needed.
 *   peers — named colleagues only (post swaps, handover notes).
 *   super — the supervisor (relief requests, and the roster they publish).
 *
 * Nothing moves from `mine` to another zone automatically. Moving anything
 * requires an explicit action with a preview of exactly what will be shared.
 */
export const ZONES = {
  mine: {
    key: 'mine',
    icon: 'Lock',
    bn: 'নিজের',
    en: 'Mine',
    explainBn: 'এই পাতার সব কিছু শুধু আপনার ফোনে থাকে। আর কেউ দেখতে পায় না।',
    explainEn: 'Everything on this screen stays on your phone. Nobody else can see it.',
  },
  peers: {
    key: 'peers',
    icon: 'Users',
    bn: 'সহকর্মী',
    en: 'Colleagues',
    explainBn: 'এই পাতার তথ্য শুধু আপনি যে সহকর্মীকে বেছে নেন, তিনি দেখেন।',
    explainEn: 'Only the colleague you choose can see what is on this screen.',
  },
  super: {
    key: 'super',
    icon: 'Building2',
    bn: 'সুপারভাইজার',
    en: 'Supervisor',
    explainBn: 'এই পাতার তথ্য সুপারভাইজার দেখেন। আপনার নিজের কিছু এখানে যায় না।',
    explainEn: 'Your supervisor sees what is on this screen. Nothing of your own goes here.',
  },
}

const stores = {
  mine: createStore('ats-mine', 'kv'),
  peers: createStore('ats-peers', 'kv'),
  super: createStore('ats-super', 'kv'),
}

export const zoneGet = (zone, key) => get(key, stores[zone])
export const zoneSet = (zone, key, value) => set(key, value, stores[zone])
