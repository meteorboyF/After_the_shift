# Demo script — After the Shift

A click-through for the CSE 4451 presentation. About **6–7 minutes** at a talking pace.

---

## Before you start

```bash
cd backend && ./mvnw spring-boot:run
```

```bash
cd frontend && npm run dev
```

Open **http://localhost:5173** and set the browser to a phone-sized viewport
(DevTools → device toolbar → iPhone 12 Pro or similar). The app is designed for
one thumb at 375px; showing it desktop-width undersells every layout decision.

**The app opens on a demo launcher** (`/demo`). It explains what the project is, starts each
task at its real first screen, reaches the supervisor view, and has a **Reset the demo** button
— use that between run-throughs rather than clearing storage by hand.

The launcher is scaffolding, not product. Nothing inside the guard's experience changes: once
you press **গার্ডের মতো শুরু করুন** ("Start as a guard") every screen is exactly as designed.
A small **ডেমো** chip in the top bar returns you to the launcher from any screen — except the
grounding exercise, which stays empty apart from its Stop control.

If you need to reset from the console instead:

```js
indexedDB.databases().then(dbs => dbs.forEach(d => indexedDB.deleteDatabase(d.name)));
localStorage.clear();
```

To reseed the backend as well, stop it, `rm -rf backend/data`, and start it again.
The `demo` profile seeds one guard, 5 past check-ins across different hours, and
5 relief requests (4 accepted, 1 pending), so no summary screen is ever empty.

> If a browser asks for microphone permission, **allow it** — Task 1's waveform is
> driven by the real mic. If you decline, the app still works and shows
> "মাইক পাওয়া যায়নি"; that is the designed degradation, and it is worth
> mentioning but not worth demoing by accident.

---

## 0 · PIN (20 seconds)

Open **পিন স্ক্রিন** from the launcher. Tap `১ ২ ৩ ৪`, then again to confirm.

> "Not a security feature, and not one of the three tasks. It's here because P6 told
> us he was already worried about a supervisor picking up his phone. Note the keypad
> is Bangla numerals, and there's a plain 'use without a PIN' option — a guard who
> doesn't want this shouldn't have to fight the app."

The PIN is salted and SHA-256 hashed in `localStorage`. Closing the app re-locks it.

---

## 1 · Home — what we deliberately left out (30 seconds)

> "Before the tasks, look at what isn't here. No greeting by name. No date banner.
> No statistics. No notification badge. No mood picker, no emoji row, no 'how are
> you feeling today?'. Our participants deflected every question about how work made
> them feel, and answered freely about what happened on shift. So the app asks about
> the shift — `আজকের ডিউটি শেষ?`, today's duty finished — and never about the person."

Point at the photo behind the text.

> "That backdrop is chosen by the clock, not by the user. After 6pm it's a night post.
> There is no grid of faces to pick from and no image is ever labelled with a feeling."

---

## 2 · TASK 1 — Post-shift check-in (90 seconds)

**Tap the big amber mic (`বলুন`).**

> "One tap. The screen that comes up is almost empty — a waveform, the word
> 'listening', and a timer. No prompt, no question, no suggestion chips. It listens;
> it does not ask. Those seven bars are driven by the real microphone through an
> AnalyserNode, so you can see it's actually hearing you."

**Speak for a few seconds in any language, then tap `শেষ`.**

> "Now, before anything is stored, it tells you who can see it."

**Pause on the privacy screen.** Read the three lines out.

> "Only you. Your supervisor cannot see it — drawn deliberately larger than the rest.
> Stays on your phone. And the two buttons are the same size: deleting what you just
> said is a normal thing to do, not a penalty for wasting the app's time."

**Tap `রাখুন`.**

> "And here's the part that matters most. P7 rejected the whole idea of expressing
> himself — 'we can share our inner feelings, but I don't get any benefit from it.'
> A screen that just says 'saved' proves him right. So this one shows the week, and
> one line the app worked out that he never told it —" *(point)* "— heaviest time,
> 9 AM."

> "Seven boxes, filled where there's an entry. No streak counter, no percentage, and
> no weekday labels underneath — because labelling them would make every gap
> nameable. 'You missed Tuesday' is exactly the guilt mechanic we ruled out. These
> guards skip their own weekly day off."

**Optionally** tap `আগের রেকর্ড` to show playback and per-entry delete.

---

## 3 · TASK 2 — Post-incident grounding (90 seconds)

**Go home, tap `এখন কষ্ট হচ্ছে`** ("having a hard time right now").

> "One tap from home. No confirmation, no form, nothing to fill in. And notice the
> words that never appear anywhere in this feature: stress, mental health, therapy,
> counselling. Framing decided acceptance in our interviews — 'an app like Facebook
> for work complaints' got three refusals; 'say what you went through, it just
> listens' got acceptances."

> "These three options aren't meditation-app content. They're what the guards told us
> they already do — water on the face, slow breathing, a short walk."

Tap the speaker icon to read them aloud.

> "For guards who'd rather listen than read. P5 carries a button phone; several are
> reading this at 3am after twelve hours."

**Tap `ধীরে শ্বাস` (slow breathing).**

> "This is the emptiest screen in the app. A circle, two words, a thin line, and one
> button. No countdown, no percentage, no encouragement text."

**Let it run through at least one full cycle — 12 seconds.**

> "Four seconds in, hold two, six seconds out. The longer exhale is the part that
> actually settles you, so that timing isn't decoration — it's the exercise. It's also
> spoken and buzzes, so it works with the phone in your pocket and the screen dark.
> P4 can't openly use a phone on duty."

**Tap `বন্ধ করুন`.**

> "Full width, always on screen, and it leaves instantly. No corner ×, no 'are you
> sure?'. Stopping is a legitimate thing to do."

**To show the end screen**, run the 1-minute water option to completion, or just
describe it:

> "At the end it says 'done', and one grey line: 'this was not recorded anywhere.'"

**This is a good moment to show the schema** (`http://localhost:8080/h2-console`,
JDBC URL `jdbc:h2:file:./data/afthershift`, user `sa`, no password):

```sql
SELECT * FROM GROUNDING_COMPLETIONS;
```

> "Five columns. There is no guard column at all — not hidden, absent. And the date
> is a DATE, not a timestamp, because a precise time could be matched against a duty
> roster to work out who it was. A row here says 'somebody did a breathing exercise
> that day' and cannot be narrowed further. The line on screen is a factual claim
> about this table."

---

## 4 · TASK 3 — Relief request (2 minutes)

**Home → check in → `বিশ্রাম চাই`**, or go straight to `/relief`.

> "This is the only place the app touches the hierarchy. When we asked P8 to design a
> wellbeing system, he didn't describe an app — he described post rotation. 'If
> someone else could be placed there and I could be moved for half an hour, then I
> would get a little rest.' These three options are his words."

Point at the grey line.

> "'You don't have to give a reason' — said before we even offer to take one."

**Tap `আধা ঘণ্টা বিশ্রাম`.**

> "You can attach a spoken reason. Notice the layout is arguing for privacy: the
> filled primary button is 'send without a reason', on top. The mic underneath is
> 96 pixels — the one on the home screen is 160. Attaching a reason is possible,
> not expected. And there is no text field here, or anywhere in this app."

**Tap `কারণ ছাড়াই পাঠান`.**

> "And this is the privacy wall, drawn on the screen."

**Stay on the preview for a moment.**

> "That card is exactly what the supervisor receives: the request type and the time.
> It isn't a mock-up we drew — it's rendered from the same payload object the API is
> about to send, narrowed by the same function. If someone widened that later, the
> extra field would appear on the guard's screen before it ever reached a supervisor."

> "And underneath, struck through: your check-ins, your recordings, your exercises."

**Tap `পাঠান`.**

> "Status, and the tally: five requests this month, four accepted. That tally is the
> direct answer to P7. It's the app showing that asking produced something. And you
> can withdraw any request — asking for rest is never irreversible."

---

## 5 · The privacy wall, proven (60 seconds)

**Navigate to `/supervisor`.**

> "A demo route, to show what the other side actually sees."

> "Type, time, status. No name, no guard id, and no reason — even for requests where
> the guard chose to attach one. Note the line on the supervisor's own screen:
> check-ins, recordings and exercises are not here."

**Accept the pending request, then go back to `/relief/status`.**

> "And the guard sees the decision — the tally moves."

**Now the part worth showing in a terminal:**

```bash
curl -s localhost:8080/api/supervisor/relief | python3 -m json.tool | head -12
```

> "Four fields. This isn't a UI filter — the supervisor package in the Spring Boot
> code imports nothing from the check-in, grounding, or relief packages. It depends
> on a port it declares itself, and `ReliefCard` is a four-field record with nowhere
> to put a transcript. A supervisor endpoint for check-ins couldn't be written
> without first adding a dependency that doesn't exist."

```bash
cd backend && ./mvnw test
```

> "And that's asserted in a test, so it fails the build rather than the code review.
> We checked the test actually catches it by adding the forbidden import on purpose."

---

## 6 · Offline (45 seconds)

**Stop the backend** (Ctrl-C in its terminal). Then, in the app:

**Make a check-in and a relief request with the server down.**

> "Everything still works. Writes go to IndexedDB first and render immediately —
> the guard never waits on a network round trip to be told their entry was kept.
> P7 has no internet data at home; P6 only uses his phone properly once he's off
> campus. Offline is the normal case here, not the error case."

Point at the small pill at the top.

> "A quiet indicator. Not a modal, not a red banner, and it blocks nothing."

**Restart the backend**, then in the console:

```js
window.dispatchEvent(new Event('online'))
```

> "And the outbox drains — the entries made offline reach the server, and the app
> links the ids back. If you'd withdrawn a request before it ever synced, the queued
> send is cancelled rather than delivered late."

---

## 7 · Closing (20 seconds)

> "Three tasks, no typing anywhere, and not one question about how anybody feels.
> Every constraint that makes this app look unusual came out of the interviews —
> the missing mood picker, the missing streaks, the missing reminders. The hardest
> part of the design wasn't what to add. It was leaving things out that every
> wellbeing app has."

---

## If something goes wrong on stage

| Symptom | Fix |
| --- | --- |
| Screens look empty / no history | Backend not running, or local storage cleared without reseeding. Restart the backend and reload. |
| Waveform bars are flat | Microphone permission was denied. The app still works — the "no microphone" line is the designed fallback. |
| Breathing circle doesn't animate | Check the OS "reduce motion" setting; the app honours it and replaces movement with fades. That's intentional, and a fine thing to point out. |
| Nothing at `/supervisor` | It reads the backend directly and has no offline cache by design. Start the backend. |
| PIN screen won't accept input | Needs a secure context for SubtleCrypto. `localhost` is fine; a raw LAN IP over http is not — the app then skips the PIN entirely. |
