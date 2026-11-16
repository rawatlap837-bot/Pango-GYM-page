const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[\d\s().-]+$/
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
// Reject control characters in user-entered text.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/
const UNCONFIRMED_MESSAGE = 'We couldn’t confirm your submission. Please try again.'

export function normalizeRegistration(values) {
  return {
    name: String(values.name ?? '').trim(),
    phone: String(values.phone ?? '').trim().replace(/[\s().-]/g, ''),
    email: String(values.email ?? '').trim().toLowerCase(),
    gymName: String(values.gymName ?? '').trim(),
  }
}

export function validateRegistration(values) {
  const fields = normalizeRegistration(values)
  const errors = {}
  if (fields.name.length < 2 || fields.name.length > 80 || CONTROL_CHARACTERS.test(fields.name)) {
    errors.name = 'Enter your full name (2–80 characters).'
  }
  const digits = fields.phone.replace(/^\+/, '')
  const rawPhone = String(values.phone ?? '').trim()
  if (rawPhone.length > 30 || !PHONE_PATTERN.test(rawPhone) || !/^\d{10,15}$/.test(digits) || CONTROL_CHARACTERS.test(rawPhone)) {
    errors.phone = 'Enter a valid phone number with 10–15 digits.'
  }
  if (fields.email.length > 254 || !EMAIL_PATTERN.test(fields.email) || CONTROL_CHARACTERS.test(fields.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (fields.gymName.length > 120 || CONTROL_CHARACTERS.test(fields.gymName)) {
    errors.gymName = 'Use 120 characters or fewer for your gym name.'
  }
  return errors
}

export function createSubmissionId(cryptoImpl = globalThis.crypto) {
  if (typeof cryptoImpl?.randomUUID === 'function') return cryptoImpl.randomUUID()
  if (typeof cryptoImpl?.getRandomValues !== 'function') {
    throw new Error('Please use an up-to-date browser to submit your details.')
  }
  // getRandomValues also works when testing the site over HTTP on a local phone.
  const bytes = cryptoImpl.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 15) | 64
  bytes[8] = (bytes[8] & 63) | 128
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function isAppsScriptEndpoint(endpoint) {
  try {
    const url = new URL(endpoint)
    return url.protocol === 'https:' && url.hostname === 'script.google.com'
      && !url.username && !url.password && !url.port
      && /^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname)
  } catch {
    return false
  }
}

export async function submitRegistration(values, {
  endpoint = import.meta.env?.VITE_GOOGLE_SCRIPT_URL,
  fetchImpl = globalThis.fetch,
  timeoutMs = 20000,
} = {}) {
  const fieldErrors = validateRegistration(values)
  if (Object.keys(fieldErrors).length) {
    const error = new Error('Please check the highlighted fields.')
    error.fieldErrors = fieldErrors
    throw error
  }
  if (!isAppsScriptEndpoint(endpoint)) {
    throw new Error('Registration is temporarily unavailable. Please try again later.')
  }
  if (!UUID_PATTERN.test(values.submissionId ?? '')) {
    throw new Error('Please close the form and try again.')
  }

  const controller = new AbortController()
  const submissionId = values.submissionId.toLowerCase()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    // A URL-encoded POST avoids a CORS preflight on the Apps Script endpoint.
    // Read the real response: an opaque no-cors response cannot confirm a save.
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      body: new URLSearchParams({
        ...normalizeRegistration(values),
        submissionId,
        website: String(values.website ?? ''),
      }),
      credentials: 'omit',
      redirect: 'follow',
      signal: controller.signal,
    })
    if (!response.ok || response.type === 'opaque') throw new Error(UNCONFIRMED_MESSAGE)
    const result = await response.json()
    if (result.ok !== true) {
      const error = new Error(typeof result.error === 'string' ? result.error : UNCONFIRMED_MESSAGE)
      if (result.errors && typeof result.errors === 'object') {
        error.fieldErrors = Object.fromEntries(
          ['name', 'phone', 'email', 'gymName']
            .filter((field) => typeof result.errors[field] === 'string')
            .map((field) => [field, result.errors[field]]),
        )
      }
      throw error
    }
    if (result.submissionId !== submissionId) throw new Error(UNCONFIRMED_MESSAGE)
    return result
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('This is taking longer than expected. Please try again; your details are still here.')
    }
    if (error instanceof TypeError || error instanceof SyntaxError) throw new Error(UNCONFIRMED_MESSAGE)
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
