# After the Shift · শিফটের পরে

A Bangla-first, voice-first wellbeing support prototype for security guards working 12-hour
shifts at a university campus in Dhaka, Bangladesh.

Built for **CSE 4451 (Human–Computer Interaction), United International University**. The
design is grounded in eight semi-structured interviews with working security guards; the
findings from those interviews are hard constraints on the interface, not flavour text.
See [SPEC.md](SPEC.md) for the full brief and [CLAUDE.md](CLAUDE.md) for the condensed rules.

> **This is a course prototype, not a clinical tool.** It does not screen, diagnose, triage or
> treat anything, it is not a crisis service, and it has never been evaluated for safety or
> efficacy. It is a design artefact made to demonstrate an interaction concept.

---

## What it does

Three tasks, all completable without typing a single character.

### Task 1 — Post-shift check-in
The guard speaks about the shift that just ended and saves it. Before anything is stored, the
app states plainly, in Bangla, who can see it: only you, not your supervisor, stays on your
phone. Saving produces a week strip and one derived line — *"heaviest time — 9 AM"* — computed
from when past entries were recorded.

### Task 2 — Post-incident grounding
One tap from home, no form and no confirmation, into a two-minute exercise: water on the face,
slow breathing, or a short walk. These are the guards' own coping strategies, taken verbatim
from the interviews. The exercise is audio-guided so it works with the screen dark, and a
full-size **বন্ধ করুন** (Stop) is visible on every frame of it. Nothing about it is persisted
beyond an anonymous counter with no user attached.

### Task 3 — Relief / post-rotation request
Half an hour of rest, a change of post, or a post in the shade — the three things participant
P8 described when asked to design a wellbeing system. Attaching a spoken reason is optional and
is not the default. Before sending, the guard sees **exactly** what the supervisor will
receive, rendered from the same payload the API sends, alongside a crossed-out list of what
the supervisor will never see. Requests produce a status and a monthly accepted-vs-asked tally.

---

## Why it looks the way it does

Some of this will read as bad product instinct. Each of these exists because a participant
rejected the conventional pattern:

| Not here | Why |
| --- | --- |
| Mood pickers, emoji, 1–10 scales | Workplace pain had no vocabulary for our participants. They deflected "how do you feel about work" and answered freely about shift events. So the app asks about the shift, never the person. |
| Text input, anywhere | P5 carries a button phone. P4 cannot use a phone on duty. Typing Bangla on a phone at 3am after twelve hours is a barrier, not an interaction. |
| Streaks, badges, reminders | These guards skip their weekly day off. Guilt mechanics are inappropriate, and the app never initiates contact. |
| "Do you feel better now?" after grounding | That turns grounding into assessment. |
| Anything shared upward from Tasks 1 and 2 | P6: *"if they see it, then they take our statement."* Surveillance concern was already shaping behaviour before any system existed. |
| A screen that just says "saved" | P7 rejected expression outright — he saw no benefit in it. Every completed action here produces a visible result. |

---

## Tech stack

**Frontend** — React 18, Vite, JavaScript, Tailwind CSS, Framer Motion, React Router, Zustand,
Axios, `idb-keyval` for offline storage. Voice via the Web Speech API (`bn-BD`) for
transcription and `MediaRecorder` for audio; both degrade gracefully, and a browser without
speech recognition still records and saves audio without a transcript.

**Backend** — Spring Boot 3.5 on Java 21, Spring Web, Spring Data JPA, file-based H2, Lombok,
Bean Validation, Maven.

Hind Siliguri is vendored into `frontend/public/fonts/` rather than linked from a CDN, because
the app is offline-first and Bangla must render with no network at all.

---

## Running it

### Frontend

```bash
cd frontend && npm install && npm run dev
```

Serves on http://localhost:5173. **The frontend runs fine with the backend stopped** — that is
a design requirement, not a fallback. Writes go to IndexedDB first and render immediately, then
queue in a durable outbox (`src/lib/outbox.js`) that survives a reload and drains when a
connection appears. Deleting something that has not synced yet cancels its queued create, so a
withdrawn request is never delivered late.

For a presentation walkthrough, see [DEMO.md](DEMO.md).

### Backend

Maven does not need to be installed; the wrapper fetches it on first run.

```bash
cd backend && ./mvnw spring-boot:run
```

Serves on http://localhost:8080. The H2 file database lives at `backend/data/afthershift.mv.db`
so demo data survives a restart, and the H2 console is at http://localhost:8080/h2-console
(JDBC URL `jdbc:h2:file:./data/afthershift`, user `sa`, no password).

The `demo` profile is active by default and seeds one demo guard, five past check-ins across
different hours, and five relief requests (four accepted, one pending), so every summary
screen and the monthly tally are non-empty in a presentation.

---

## Repository layout

```
frontend/
  public/fonts/            Hind Siliguri, self-hosted
  public/images/guards/    guard photographs, named by semantic key
  src/components/          ScreenShell, BigButton, VoiceButton, GuardIllustration, OfflineBadge
  src/features/            checkin/ grounding/ relief/
  src/lib/                 api client, offline queue, speech, haptics, guardImages
  src/i18n/                bn.js (primary), en.js
backend/
  src/main/java/com/aftertheshift/
    checkin/ grounding/ relief/ supervisor/ common/
```

The `supervisor` package imports nothing from any feature package. It declares the narrow
interface it needs (`ReliefBoardPort`) and `relief` implements it, so the dependency runs
inward. `ReliefCard` is a four-field record with no slot for a guard id, reason audio or
transcript — a supervisor endpoint for check-ins could not be written without first adding a
dependency that does not exist.

`PrivacyWallTest` asserts this and fails the build if it is ever broken:

```bash
cd backend && ./mvnw test
```

---

## A note on the photographs

`frontend/public/images/guards/` holds photographs of security guards used as low-opacity,
amber-toned backdrops. They reflect the app's context — night post, day post, after an
incident — and are chosen deterministically from the clock and the current screen. The user
never picks one, they are never shown as a grid, and they are never labelled with an emotion.
They are included here for coursework demonstration only.
