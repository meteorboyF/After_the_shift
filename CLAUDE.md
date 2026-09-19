# CLAUDE.md — constraints for this repository

**After the Shift** is a Bangla-first, voice-first wellbeing prototype for security guards
working 12-hour shifts at a university campus in Dhaka. Course project, CSE 4451, United
International University. Full brief: [SPEC.md](SPEC.md).

The rules below come from eight semi-structured interviews with working guards. Several of
them will read as bad product instinct. They are not. Each one exists because a participant
rejected the conventional pattern. **Do not add the conventional version back.** If something
here looks genuinely wrong or self-contradictory, say so and ask — do not silently deviate.

---

## 1. Non-negotiable design rules

1. **Never ask the user to name, rate, score or pick a feeling.** No mood selector, no emoji
   picker, no 1–10 scale, no "how are you feeling today?", no sentiment tags. The check-in
   asks about the *shift*, not the person.
2. **Never require typing.** There is no text input field anywhere in the application. Every
   input is voice or a tap on a large target.
3. **No streaks, badges, points, gamification, or "you missed a day" nudges.** These guards
   skip their weekly day off; guilt mechanics are inappropriate.
4. **The grounding exercise must be abandonable from every screen**, with a full-size,
   always-visible exit control. Never a corner "×", never a confirmation dialog on exit.
5. **Nothing from Task 1 or Task 2 may ever be visible to a supervisor.** The UI states this
   explicitly, in Bangla, on the screens where it matters — not buried in settings.
6. **Bangla is the primary language, not a translation.** All UI strings are authored in
   Bangla first. English is a secondary toggle only.
7. **Every completed action must produce a visible result.** A screen that only says "saved"
   is the thing P7 rejected. Check-ins produce a weekly summary; relief requests produce a
   status and a tally.
8. **Offline-first.** Assume no connectivity. The app fully functions with the backend
   unreachable, and syncs later.
9. **No push notifications, no reminders, no "check in now" prompts.** The app never
   initiates contact.
10. **No mood-based imagery selection by the user.** Guard photos reflect app context, never
    the user's emotion, and are never presented as a choosable grid or labelled with a feeling.

### Architectural corollaries

- The Spring Boot `supervisor` package must have **no dependency at all** on the check-in or
  grounding repositories. The privacy wall is enforced in the architecture, not in a DTO mapper.
- `GroundingCompletion` has **no user foreign key** and no timestamp finer than the day. It is
  an anonymous tally, nothing more.
- Task 3's preview screen renders from **the same payload the API will send**, so what the
  guard is shown cannot drift from what the supervisor receives.

---

## 2. Design tokens

Night shift, sodium lamp: warm amber on deep charcoal-navy. Matches the project deck.

```js
colors: {
  ink:   { DEFAULT: '#12151F', soft: '#1A1F2E', raised: '#232939' },
  amber: { DEFAULT: '#E8A13A', deep: '#B26B00', glow: '#FFC46B' },
  cream: '#F5EDE1',
  muted: '#8A93A6',
  ok:    '#5FA87A',
  warn:  '#C97A4A',   // never pure red anywhere in this app
}
```

- **Radius** generous — `rounded-2xl` / `rounded-3xl` / `rounded-4xl`. Nothing sharp.
- **Shadow** a soft amber glow on primary actions (`shadow-glow`), not a grey drop shadow.
  One light source, always from above.
- **Never** pure black or pure white.

### Typography

- Hind Siliguri, self-hosted in `frontend/public/fonts/` (not CDN — offline-first).
- Base body 18px; primary labels 22–26px (`text-label`, `text-label-lg`).
- Bangla needs more leading than Latin: `leading-relaxed` minimum, body line-height 1.75.
- Max ~7 Bangla words per line on any primary screen (`.measure`, `.measure-wide`).

### Touch and layout

- Minimum tap target **64×64px** (`.tap`). The primary voice button is **160px** diameter.
- Mobile-first, single column, `max-w-screenish` (480px), centred. Gloved hands, one thumb,
  bright sun.
- One obvious primary action per screen. A second equally-weighted button means redesign.
- Contrast ratio **≥ 7:1** for primary text.

### Motion (Framer Motion)

Calm, never bouncy.

- Page transitions: fade + 12px slide, 280ms, `ease-calm` = `cubic-bezier(0.22, 1, 0.36, 1)`.
- Voice button idle: breathing pulse, 4s cycle, scale 1 → 1.04.
- Recording: 7-bar waveform driven by **real mic amplitude** via `AnalyserNode` — not a fake
  random animation.
- Breathing exercise: circle scales 1 → 1.6 over 4s inhale, holds 2s, 1.6 → 1 over 6s exhale.
  **This timing is the exercise.** Get it right.
- `prefers-reduced-motion` replaces all of the above with opacity fades.

---

## 3. Stack and layout

Frontend: React 18 + Vite, **JavaScript (not TypeScript)**, Tailwind, Framer Motion, React
Router, Zustand, Axios, `idb-keyval`.
Backend: Spring Boot 3.5, Java 21 target, Spring Web + Data JPA, file-based H2, Lombok, Bean
Validation, Maven (via the vendored `./mvnw` wrapper — Maven is not installed globally).
Voice: Web Speech API (`lang = 'bn-BD'`) for transcription, `MediaRecorder` for the blob.
Both degrade gracefully: no speech recognition still records audio, stores it without a
transcript, and never blocks the user.

```
frontend/src/{components,features/{checkin,grounding,relief},lib,i18n,styles}
backend/src/main/java/com/aftertheshift/{checkin,grounding,relief,supervisor,common}
```

## 4. Repository conventions

- Commit in logical chunks as work proceeds, not one giant commit at the end.
- **Do not add a `Co-Authored-By` trailer to commits.** This is a graded course project.
- Do not push unless asked.
