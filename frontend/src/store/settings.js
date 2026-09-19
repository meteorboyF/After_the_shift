import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PRIMARY_LANGUAGE } from '../i18n/index.js'
import { hashPin, newSalt } from '../lib/pin.js'

/**
 * Language and the on-device PIN.
 *
 * `unlocked` is deliberately excluded from persistence: closing the app should
 * re-lock it. Everything else lives in localStorage and never leaves the phone.
 */
export const useSettings = create(
  persist(
    (set, get) => ({
      lang: PRIMARY_LANGUAGE,
      pinHash: null,
      pinSalt: null,
      pinSkipped: false,
      unlocked: false,

      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === 'bn' ? 'en' : 'bn' }),

      async setPin(pin) {
        const salt = newSalt()
        set({ pinHash: await hashPin(pin, salt), pinSalt: salt, pinSkipped: false, unlocked: true })
      },

      async verifyPin(pin) {
        const { pinHash, pinSalt } = get()
        if (!pinHash || !pinSalt) return false
        const ok = (await hashPin(pin, pinSalt)) === pinHash
        if (ok) set({ unlocked: true })
        return ok
      },

      /** Running without a PIN is a first-class choice, not a degraded mode. */
      skipPin: () => set({ pinSkipped: true, unlocked: true }),
      lock: () => set({ unlocked: false }),
    }),
    {
      name: 'ats-settings',
      partialize: ({ lang, pinHash, pinSalt, pinSkipped }) => ({
        lang,
        pinHash,
        pinSalt,
        pinSkipped,
      }),
    },
  ),
)
