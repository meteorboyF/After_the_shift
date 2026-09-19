/**
 * English — secondary. Mirrors the shape of bn.js.
 *
 * Bangla is the source of truth for wording and tone; these are translations of
 * it. If a key is missing here the lookup falls back to Bangla rather than
 * showing a raw key.
 */
export default {
  common: {
    appName: 'After the Shift',
    back: 'Back',
    help: 'Help',
    pastEntries: 'Past entries',
    otherLanguage: 'বাংলা',
    offline: 'Offline',
    offlineHint: 'Kept on your phone',
    listen: 'Listen',
    soon: 'Coming in the next phase',
  },

  pin: {
    setHeading: 'Set a PIN',
    confirmHeading: 'Enter it again',
    unlockHeading: 'Enter your PIN',
    hint: 'Stays on this phone only',
    mismatch: 'That did not match — try again',
    wrong: 'Wrong PIN',
    skip: 'Use without a PIN',
    erase: 'Erase',
  },

  home: {
    heading: 'Today’s duty finished?',
    shiftLine: '{hours} hours completed',
    speak: 'Speak',
    hardTime: 'Having a hard time right now',
  },

  record: {
    listening: 'Listening',
    done: 'Done',
    cancel: 'Cancel',
    noMic: 'No microphone available',
    noMicHint: 'You can still keep this without sound',
  },

  privacy: {
    heading: 'Who can see this entry?',
    onlyYou: 'Only you',
    notSupervisor: 'Your supervisor cannot see it',
    staysOnPhone: 'Stays on your phone',
    keep: 'Keep',
    discard: 'Delete',
  },

  saved: {
    heading: 'Saved',
    weekLabel: 'Last seven days',
    heaviest: 'Heaviest time — {time}',
    requestRelief: 'Request relief',
    home: 'All right',
  },

  grounding: {
    heading: 'Two minutes',
    water: 'Water on the face',
    breathing: 'Slow breathing',
    walk: 'Walk a little',
    minutes: '{n} min',
    listen: 'Listen',
    exit: 'Leave',
    stop: 'Stop',
    in: 'In',
    out: 'Out',
    waterCue: 'Put cold water on your face',
    breathingCue: 'Breathe slowly',
    walkCue: 'Walk slowly for a little while',
    done: 'Done',
    notRecorded: 'This was not recorded anywhere',
    again: 'Again',
  },

  entries: {
    heading: 'Past entries',
    empty: 'Nothing here yet',
    play: 'Play',
    pause: 'Pause',
    remove: 'Delete',
    noAudio: 'No sound',
    night: 'Night duty',
    day: 'Day duty',
  },
}
