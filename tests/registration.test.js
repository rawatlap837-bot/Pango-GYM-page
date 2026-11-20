import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createSubmissionId,
  normalizeRegistration,
  submitRegistration,
  validateRegistration,
} from '../src/lib/registration.js'

const endpoint = 'https://script.google.com/macros/s/test-deployment/exec'
const submissionId = '029895b8-c169-416a-a976-33f842ee90da'
const validFields = {
  name: 'Asha Shah',
  phone: '+91 98765 43210',
  email: 'Asha@example.com',
  submissionId,
}
const confirmed = (body = { ok: true, submissionId }) => ({
  ok: true,
  type: 'cors',
  async json() { return body },
})

test('required contact fields are valid without an optional gym name', () => {
  assert.deepEqual(validateRegistration(validFields), {})
  assert.deepEqual(normalizeRegistration({
    ...validFields,
    name: '  Asha Shah  ',
    phone: '  +91 (98765) 43210  ',
    email: '  Asha@Example.com  ',
  }), {
    name: 'Asha Shah',
    phone: '+919876543210',
    email: 'asha@example.com',
    gymName: '',
  })
  assert.deepEqual(validateRegistration({ ...validFields, gymName: '  ' }), {})
})

test('normalization preserves leading phone zeroes and trims optional gym names', () => {
  const original = { ...validFields, phone: '01234-56789', gymName: '  Fit Space  ' }
  assert.deepEqual(normalizeRegistration(original), {
    name: 'Asha Shah', phone: '0123456789', email: 'asha@example.com', gymName: 'Fit Space',
  })
  assert.equal(original.phone, '01234-56789', 'normalization must not mutate the draft')
  assert.deepEqual(normalizeRegistration({}), { name: '', phone: '', email: '', gymName: '' })
})

test('missing and malformed contact details produce only the corresponding field errors', () => {
  assert.deepEqual(Object.keys(validateRegistration({})).sort(), ['email', 'name', 'phone'])
  const invalidValues = [
    ['name', 'A'], ['name', '  '], ['name', 'x'.repeat(81)], ['name', 'Asha\nShah'],
    ['phone', '123456789'], ['phone', '1234567890123456'], ['phone', '91+9876543210'],
    ['phone', 'phone9876543210'], ['phone', '12345\n67890'], ['phone', '12345\t67890'],
    ['phone', `12345${' '.repeat(21)}67890`],
    ['email', 'asha'], ['email', 'a@@example.com'], ['email', 'asha @example.com'],
    ['email', 'a\u0000@example.com'], ['email', `${'a'.repeat(243)}@example.com`],
    ['gymName', 'x'.repeat(121)], ['gymName', 'Fit\u007fSpace'],
  ]
  for (const [field, value] of invalidValues) {
    const errors = validateRegistration({ ...validFields, [field]: value })
    assert.deepEqual(Object.keys(errors), [field], `expected only ${field} to be invalid`)
    assert.equal(typeof errors[field], 'string')
  }
})

test('accepts the documented field length boundaries', () => {
  for (const values of [
    { name: 'Al', phone: '0123456789' },
    { name: 'x'.repeat(80), phone: '+123456789012345', gymName: 'x'.repeat(120), email: `${'a'.repeat(242)}@example.com` },
  ]) {
    assert.deepEqual(validateRegistration({ ...validFields, ...values }), {})
  }
})

test('creates submission IDs with native secure UUID support', () => {
  let calls = 0
  const id = createSubmissionId({ randomUUID() { calls += 1; return submissionId } })
  assert.equal(id, submissionId)
  assert.equal(calls, 1)
})

test('uses secure getRandomValues to generate a v4 UUID over local HTTP', () => {
  let calls = 0
  const id = createSubmissionId({
    getRandomValues(bytes) {
      calls += 1
      assert.ok(bytes instanceof Uint8Array)
      assert.equal(bytes.length, 16)
      bytes.forEach((_, index) => { bytes[index] = index })
      return bytes
    },
  })
  assert.equal(id, '00010203-0405-4607-8809-0a0b0c0d0e0f')
  assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  assert.equal(calls, 1)
  assert.throws(() => createSubmissionId({}), /up-to-date browser/)
  assert.throws(() => createSubmissionId(null), /up-to-date browser/)
})

test('posts exactly normalized fields as URL-encoded data and reads a matching confirmation', async () => {
  const result = await submitRegistration({
    ...validFields,
    name: '  Asha Shah  ',
    gymName: '  Fit Space  ',
    submissionId: submissionId.toUpperCase(),
  }, {
    endpoint,
    async fetchImpl(url, options) {
      assert.equal(url, endpoint)
      assert.equal(options.method, 'POST')
      assert.ok(options.body instanceof URLSearchParams)
      assert.deepEqual(Object.fromEntries(options.body), {
        name: 'Asha Shah', phone: '+919876543210', email: 'asha@example.com',
        gymName: 'Fit Space', submissionId, website: '',
      })
      assert.equal(options.credentials, 'omit')
      assert.equal(options.redirect, 'follow')
      assert.notEqual(options.mode, 'no-cors')
      assert.equal(options.headers, undefined, 'custom headers could force a CORS preflight')
      assert.ok(options.signal instanceof AbortSignal)
      return confirmed()
    },
  })
  assert.deepEqual(result, { ok: true, submissionId })
})

test('uses the configured Apps Script URL when no endpoint is passed', async () => {
  await submitRegistration(validFields, {
    async fetchImpl(url) {
      assert.equal(url, 'https://script.google.com/macros/s/AKfycbwShfk3GN4e5RZ_h0hEau3c40IwebGFnWZg1ifCXaWZiDLkxtVjIeqUx36gDKq5nYcZdA/exec')
      return confirmed()
    },
  })
})

test('required-only submissions send an empty gym name and retain the honeypot for server validation', async () => {
  await submitRegistration({ ...validFields, website: 'spam.example' }, {
    endpoint,
    async fetchImpl(_, options) {
      assert.equal(options.body.get('gymName'), '')
      assert.equal(options.body.get('website'), 'spam.example')
      return confirmed()
    },
  })
})

test('invalid input, IDs, or deployment URLs never make a network request', async () => {
  let fetches = 0
  const fetchImpl = async () => { fetches += 1; return confirmed() }
  await assert.rejects(submitRegistration({ ...validFields, email: 'invalid' }, { endpoint, fetchImpl }), error => {
    assert.deepEqual(Object.keys(error.fieldErrors), ['email'])
    return true
  })
  for (const badEndpoint of [
    '', null, 'not-a-url', 'http://script.google.com/macros/s/test/exec',
    'https://example.com/macros/s/test/exec', 'https://script.google.com/macros/s/test/dev',
    'https://user:password@script.google.com/macros/s/test/exec',
    'https://script.google.com:8443/macros/s/test/exec',
  ]) {
    await assert.rejects(submitRegistration(validFields, { endpoint: badEndpoint, fetchImpl }), /temporarily unavailable/)
  }
  for (const id of ['', 'not-a-uuid']) {
    await assert.rejects(submitRegistration({ ...validFields, submissionId: id }, { endpoint, fetchImpl }), /close the form/)
  }
  assert.equal(fetches, 0)
})

test('backend rejection retains safe field errors without importing arbitrary keys', async () => {
  const response = {
    ok: false,
    error: 'Please check the highlighted fields.',
    errors: { email: 'Enter a valid email address.', gymName: 'Gym name is too long.', name: null, secret: 'not a form field' },
  }
  await assert.rejects(submitRegistration(validFields, {
    endpoint, fetchImpl: async () => confirmed(response),
  }), error => {
    assert.equal(error.message, response.error)
    assert.deepEqual(error.fieldErrors, { email: response.errors.email, gymName: response.errors.gymName })
    return true
  })
})

test('opaque, malformed, failed, empty, and mismatched responses cannot report success', async () => {
  const responses = [
    { ...confirmed(), type: 'opaque' },
    { ...confirmed(), ok: false, status: 500 },
    { ...confirmed(), async json() { throw new SyntaxError('Unexpected token <') } },
    confirmed(null),
    confirmed({}),
    confirmed({ ok: 'true', submissionId }),
    confirmed({ ok: true }),
    confirmed({ ok: true, submissionId: 'bd166c04-e1db-4cfc-8e11-e01d491e4e46' }),
  ]
  for (const response of responses) {
    await assert.rejects(submitRegistration(validFields, {
      endpoint, fetchImpl: async () => response,
    }), /confirm your submission/)
  }
})

test('a network failure can be retried with the same submission ID', async () => {
  const requests = []
  const fetchImpl = async (_, options) => {
    requests.push(Object.fromEntries(options.body))
    if (requests.length === 1) throw new TypeError('Failed to fetch')
    return confirmed()
  }
  await assert.rejects(submitRegistration(validFields, { endpoint, fetchImpl }), /confirm your submission/)
  assert.deepEqual(await submitRegistration(validFields, { endpoint, fetchImpl }), { ok: true, submissionId })
  assert.equal(requests.length, 2)
  assert.equal(requests[0].submissionId, requests[1].submissionId)
  assert.deepEqual(requests[0], requests[1])
})

test('a timed-out request aborts and gives a retryable error', async () => {
  let requestSignal
  await assert.rejects(submitRegistration(validFields, {
    endpoint,
    timeoutMs: 5,
    fetchImpl: async (_, { signal }) => {
      requestSignal = signal
      return new Promise((_, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true })
      })
    },
  }), /taking longer than expected/)
  assert.equal(requestSignal.aborted, true)
})

test('successful requests clear their abort timeout', async () => {
  let requestSignal
  await submitRegistration(validFields, {
    endpoint,
    timeoutMs: 5,
    fetchImpl: async (_, { signal }) => { requestSignal = signal; return confirmed() },
  })
  await new Promise(resolve => setTimeout(resolve, 15))
  assert.equal(requestSignal.aborted, false)
})
