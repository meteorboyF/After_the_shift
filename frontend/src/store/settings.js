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

      /**
       * Demo scaffolding. This is a prototype shown in a presentation, so the
       * launcher is on by default — landing a visitor on a bare PIN keypad with
       * no explanation of what the app is was the wrong first impression, and
       * it left the supervisor view unreachable entirely.
       *
       * It gates nothing in the guard's experience: once started, every screen
       * is exactly as designed.
       */
      demoMode: true,
      demoStarted: false,

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

      /**
       * Entering the guard flow from the demo launcher. The PIN is skipped
       * because a presenter should not have to key in four digits to reach the
       * screens; the PIN itself is still viewable from the launcher.
       */
      startDemo: () => set({ demoStarted: true, pinSkipped: true, unlocked: true }),

      /** Back to the launcher without wiping anything. */
      returnToDemo: () => set({ demoStarted: false }),

      /** Show the PIN screen deliberately, from the launcher. */
      showPinScreen: () =>
        set({ demoStarted: true, pinHash: null, pinSalt: null, pinSkipped: false, unlocked: false }),
    }),
    {
      name: 'ats-settings',
      partialize: ({ lang, pinHash, pinSalt, pinSkipped, demoMode, demoStarted }) => ({
        lang,
        pinHash,
        pinSalt,
        pinSkipped,
        demoMode,
        demoStarted,
      }),
    },
  ),
)
