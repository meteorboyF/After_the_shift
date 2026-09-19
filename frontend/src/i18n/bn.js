/**
 * Bangla — the primary language.
 *
 * Every string in this app is authored here first. en.js is a secondary
 * translation and may lag; the lookup in i18n/index.js falls back to this file,
 * never the other way around.
 *
 * Numerals are written as ASCII digits inside {braces} and localised at render
 * time, so `{count}টি অনুরোধ` becomes `৫টি অনুরোধ` in Bangla and `5 requests`
 * in English without duplicating the sentence.
 */
export default {
  common: {
    appName: 'শিফটের পরে',
    back: 'ফিরে যান',
    help: 'সাহায্য',
    pastEntries: 'আগের রেকর্ড',
    otherLanguage: 'English',
    offline: 'অফলাইন',
    offlineHint: 'ফোনেই আছে',
    listen: 'শুনুন',
    soon: 'পরের ধাপে আসছে',
  },

  help: {
    heading: 'সাহায্য',
    listens: 'এই অ্যাপ শুধু শোনে',
    listensBody: 'কোনো প্রশ্ন নেই, কোনো বিচার নেই।',
    privacy: 'সুপারভাইজার দেখতে পাবেন না',
    privacyBody: 'চেক-ইন, রেকর্ড ও ব্যায়াম কেউ দেখে না।',
    offline: 'ইন্টারনেট ছাড়াই চলে',
    offlineBody: 'সব কিছু ফোনেই থাকে।',
    relief: 'বিশ্রামের অনুরোধ আলাদা',
    reliefBody: 'শুধু এটাই সুপারভাইজার দেখেন।',
    // Stated plainly: this is coursework, not care.
    notClinical: 'এটি কোনো চিকিৎসা সেবা নয়।',
  },

  pin: {
    setHeading: 'একটি পিন দিন',
    confirmHeading: 'আবার দিন',
    unlockHeading: 'পিন দিন',
    hint: 'শুধু এই ফোনে থাকবে',
    mismatch: 'মেলেনি, আবার দিন',
    wrong: 'ভুল পিন',
    skip: 'পিন ছাড়াই চালান',
    erase: 'মুছুন',
  },

  home: {
    heading: 'আজকের ডিউটি শেষ?',
    shiftLine: '{hours} ঘণ্টা শেষ হয়েছে',
    speak: 'বলুন',
    hardTime: 'এখন কষ্ট হচ্ছে',
  },

  // Screen 1B. This screen listens; it does not ask. No prompt, no question,
  // no suggestion chips — adding any would make it an interview.
  record: {
    listening: 'শুনছি',
    done: 'শেষ',
    cancel: 'বাতিল',
    noMic: 'মাইক পাওয়া যায়নি',
    noMicHint: 'শব্দ ছাড়াই রাখা যাবে',
  },

  // Screen 1C. Said plainly, before anything is stored — not in a settings page.
  privacy: {
    heading: 'এই রেকর্ড কে দেখতে পাবে?',
    onlyYou: 'শুধু আপনি',
    notSupervisor: 'সুপারভাইজার দেখতে পাবেন না',
    staysOnPhone: 'ফোনেই থাকবে',
    keep: 'রাখুন',
    discard: 'মুছে ফেলুন',
  },

  // Screen 1D. The visible result — the thing P7 said was missing.
  saved: {
    heading: 'রাখা হয়েছে',
    weekLabel: 'গত সাত দিন',
    heaviest: 'বেশিরভাগ ভারি সময় — {time}',
    requestRelief: 'বিশ্রাম চাই',
    home: 'ঠিক আছে',
  },

  // Task 2. Note what never appears here: stress, mental health, therapy,
  // counselling. None of those words belong on a screen a guard opens after a
  // bad hour on a gate.
  grounding: {
    heading: 'দুই মিনিট',
    water: 'চোখে-মুখে পানি',
    breathing: 'ধীরে শ্বাস',
    walk: 'একটু হাঁটুন',
    minutes: '{n} মিনিট',
    listen: 'শুনুন',
    exit: 'বের হই',
    stop: 'বন্ধ করুন',
    in: 'নিন',
    out: 'ছাড়ুন',
    waterCue: 'চোখে-মুখে ঠান্ডা পানি দিন',
    breathingCue: 'ধীরে শ্বাস নিন',
    walkCue: 'ধীরে ধীরে একটু হাঁটুন',
    done: 'শেষ',
    // Literally true: no user id, no time finer than the day, nothing that
    // joins back to a person. See GroundingCompletion.
    notRecorded: 'এটা কোথাও লেখা হয়নি',
    again: 'আবার',
  },

  // Task 3 — the only place this app touches the hierarchy. Every screen has
  // to make visible what a supervisor will and will not see.
  relief: {
    heading: 'কি দরকার?',
    noReasonNeeded: 'কারণ বলা লাগবে না',
    // P8's own words. Not renamed into generic categories.
    rest: 'আধা ঘণ্টা বিশ্রাম',
    swap: 'পোস্ট বদল',
    shade: 'ছায়ায় পোস্ট',

    reasonHeading: 'কারণ যুক্ত করবেন?',
    sendWithoutReason: 'কারণ ছাড়াই পাঠান',
    attachReason: 'কারণ যুক্ত করুন',
    recording: 'শুনছি',
    reasonAttached: 'কারণ যুক্ত হয়েছে',

    previewHeading: 'সুপারভাইজার এটাই দেখবেন',
    willNotSee: 'যা দেখতে পাবেন না',
    checkins: 'চেক-ইন',
    recordings: 'রেকর্ড',
    exercises: 'ব্যায়াম',
    send: 'পাঠান',
    cancel: 'বাতিল',

    statusHeading: 'অনুরোধ',
    pending: 'অপেক্ষায়',
    accepted: 'গ্রহণ করা হয়েছে',
    rejected: 'এবার হয়নি',
    withdraw: 'বাতিল করুন',
    // The tally. This is the proof the app does something — do not omit it.
    tallyRequests: 'এই মাসে {n}টি অনুরোধ',
    tallyAccepted: '{n}টি গ্রহণ করা হয়েছে',
    empty: 'কোনো অনুরোধ নেই',
    newRequest: 'নতুন অনুরোধ',
    justNow: 'এইমাত্র',
    minutesAgo: '{n} মিনিট আগে',
    hoursAgo: '{n} ঘণ্টা আগে',
  },

  supervisor: {
    heading: 'সুপারভাইজার',
    subtitle: 'শুধু বিশ্রামের অনুরোধ',
    // Spelled out on the supervisor's own screen, not only the guard's.
    noAccess: 'চেক-ইন, রেকর্ড ও ব্যায়াম এখানে নেই',
    empty: 'কোনো অনুরোধ নেই',
    accept: 'গ্রহণ',
    back: 'ফিরে যান',
    // Shown on the hosted build, which has no server behind it. Says why the
    // list is empty instead of looking broken.
    needsServer: 'এই পাতা সরাসরি সার্ভার থেকে পড়ে',
    needsServerBody: 'গার্ডের নিজের পাতাগুলো ফোনেই চলে, কিন্তু এটি চলে না।',
  },

  entries: {
    heading: 'আগের রেকর্ড',
    empty: 'এখনো কিছু নেই',
    play: 'শুনুন',
    pause: 'থামান',
    remove: 'মুছে ফেলুন',
    noAudio: 'শব্দ নেই',
    night: 'রাতের ডিউটি',
    day: 'দিনের ডিউটি',
  },
}
