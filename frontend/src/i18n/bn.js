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
}
