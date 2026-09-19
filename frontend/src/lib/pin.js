/**
 * On-device PIN only. There is no account and no server auth — this is a shell
 * over local data, not a security boundary, and nothing here is sent anywhere.
 *
 * The PIN is still salted and hashed rather than stored in the clear: a guard's
 * phone may be handled by a supervisor (P6: "if they see it, then they take our
 * statement"), and a plaintext PIN sitting in localStorage would be readable by
 * anyone who opened the dev tools.
 */

export const PIN_LENGTH = 4

/** SubtleCrypto needs a secure context. On file:// or plain http it is absent. */
export function isPinSupported() {
  return typeof crypto !== 'undefined' && !!crypto?.subtle?.digest
}

export function newSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function hashPin(pin, salt) {
  const data = new TextEncoder().encode(`after-the-shift:${salt}:${pin}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function isComplete(pin) {
  return pin.length === PIN_LENGTH
}
