import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const script = readFileSync(new URL('../GoogleSheets.gs', import.meta.url), 'utf8')
const spreadsheetId = '1yrMuIfk6MZP3wOhR7FuM9jyVxr9_eYB8PMN5qd6p9MA'
const validSubmission = {
  name: 'Asha Shah',
  phone: '+91 98765 43210',
  email: 'Asha@example.com',
  gymName: '',
  submissionId: '029895b8-c169-416a-a976-33f842ee90da',
  website: '',
}

function createBackend(options = {}) {
  const rows = options.rows ?? []
  const events = []
  let held = false
  let sheetExists = options.sheetExists ?? false
  const properties = { SPREADSHEET_ID: 'test-sheet', ...options.properties }
  const requireLock = () => assert.equal(held, true, 'sheet operations must hold the script lock')
  const sheet = {
    getLastRow() { requireLock(); return rows.length },
    getRange(row, column, height, width) {
      requireLock()
      return {
        getValues() {
          requireLock()
          return rows.slice(row - 1, row - 1 + height).map(values => values.slice(column - 1, column - 1 + width))
        },
        setValues(values) {
          requireLock()
          if (options.failWrite && row > 1) throw new Error('PRIVATE_SHEET_ID or PII must not escape')
          assert.equal(values.length, height)
          values.forEach((valuesRow, offset) => {
            assert.equal(valuesRow.length, width)
            rows[row - 1 + offset] ??= []
            valuesRow.forEach((value, index) => { rows[row - 1 + offset][column - 1 + index] = value })
          })
          events.push(row === 1 ? 'headers' : 'write')
          return this
        },
        setNumberFormat(format) {
          requireLock()
          assert.deepEqual([column, height, width, format], [2, 1, 4, '@'])
          events.push('text-format')
          return this
        },
      }
    },
  }
  const context = vm.createContext({
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput(body) {
        return { body, setMimeType(type) { this.type = type; return this } }
      },
    },
    PropertiesService: {
      getScriptProperties() {
        return {
          getProperty(key) { return properties[key] ?? null },
          setProperty(key, value) { properties[key] = value; events.push(`property:${key}`) },
        }
      },
    },
    LockService: {
      getScriptLock() {
        return {
          tryLock(timeout) {
            assert.equal(timeout, 30000)
            assert.equal(held, false)
            held = !options.busy
            events.push(held ? 'lock' : 'busy')
            return held
          },
          releaseLock() { assert.equal(held, true); held = false; events.push('release') },
        }
      },
    },
    Logger: { log(message) { events.push(`log:${message}`) } },
    SpreadsheetApp: {
      openById(id) {
        requireLock()
        assert.equal(id, spreadsheetId)
        events.push('open')
        return {
          getSheetByName(name) { requireLock(); assert.equal(name, options.properties?.SHEET_NAME || 'Registrations'); return sheetExists ? sheet : null },
          insertSheet() { requireLock(); sheetExists = true; events.push('create'); return sheet },
        }
      },
      flush() { requireLock(); events.push('flush') },
    },
  })
  vm.runInContext(script, context)
  return {
    rows,
    events,
    properties,
    setupRegistrationSheet() { return context.setupRegistrationSheet() },
    getStatus() { return JSON.parse(context.doGet().body) },
    submit(parameters = validSubmission, postData) {
      const result = context.doPost({ parameter: parameters, postData })
      assert.equal(result.type, 'application/json')
      assert.equal(held, false, 'the lock must be released for every response')
      return JSON.parse(result.body)
    },
  }
}

test('setup stores the supplied spreadsheet ID and default tab name', () => {
  const backend = createBackend({ properties: { SPREADSHEET_ID: 'old-sheet' } })
  assert.equal(backend.setupRegistrationSheet(), `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`)
  assert.equal(backend.properties.SPREADSHEET_ID, spreadsheetId)
  assert.equal(backend.properties.SHEET_NAME, 'Registrations')
  assert.deepEqual(backend.events, [
    'property:SPREADSHEET_ID', 'property:SHEET_NAME',
    `log:Registration spreadsheet configured: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  ])
})

test('GET reports that the registration endpoint is live', () => {
  const backend = createBackend()
  assert.deepEqual(backend.getStatus(), {
    ok: true,
    message: 'Registration endpoint is live. Submit the website form to save your details.',
  })
})

test('saves the three required fields when optional gym name is blank', () => {
  const backend = createBackend()
  assert.deepEqual(backend.submit(), { ok: true, submissionId: validSubmission.submissionId })
  assert.deepEqual(Array.from(backend.rows[0]), ['Timestamp', 'Name', 'Phone Number', 'Email', 'Gym Name'])
  assert.equal(Object.prototype.toString.call(backend.rows[1][0]), '[object Date]')
  assert.deepEqual(Array.from(backend.rows[1].slice(1)), ['Asha Shah', "'+919876543210", 'asha@example.com', ''])
  assert.deepEqual(backend.events, ['lock', 'open', 'create', 'headers', 'text-format', 'write', 'flush', 'release'])
})

test('invalid required fields return errors and never acquire a write lock', () => {
  const backend = createBackend()
  const response = backend.submit({ ...validSubmission, name: ' ', phone: '123', email: 'invalid' })
  assert.equal(response.ok, false)
  assert.deepEqual(Object.keys(response.errors).sort(), ['email', 'name', 'phone'])
  assert.equal(backend.rows.length, 0)
  assert.deepEqual(backend.events, [])
})

test('validates optional gym length, malformed phone punctuation, and unsafe control characters', () => {
  for (const [field, value] of [['gymName', 'x'.repeat(121)], ['phone', '91+9876543210'], ['phone', '98765\n43210'], ['name', 'Asha\nShah'], ['email', 'a\u0000@example.com']]) {
    const backend = createBackend()
    const result = backend.submit({ ...validSubmission, [field]: value })
    assert.equal(result.ok, false)
    assert.ok(result.errors[field])
    assert.equal(backend.rows.length, 0)
  }
})

test('rejects honeypots, missing submission IDs, and oversized payloads without writing', () => {
  for (const fields of [{ website: 'https://spam.example' }, { submissionId: '' }]) {
    const backend = createBackend()
    assert.equal(backend.submit({ ...validSubmission, ...fields }).ok, false)
    assert.deepEqual(backend.events, [])
  }
  const backend = createBackend()
  assert.equal(backend.submit(validSubmission, { length: 10001 }).ok, false)
  assert.deepEqual(backend.events, [])
})

test('retry requests append without scanning or storing submission IDs', () => {
  const backend = createBackend()
  assert.equal(backend.submit().ok, true)
  assert.deepEqual(backend.submit(), { ok: true, submissionId: validSubmission.submissionId })
  assert.equal(backend.rows.length, 3)
  assert.equal(backend.events.filter(event => event === 'write').length, 2)
  assert.equal(Object.prototype.toString.call(backend.rows[2][0]), '[object Date]')
  assert.deepEqual(Array.from(backend.rows[2].slice(1)), ['Asha Shah', "'+919876543210", 'asha@example.com', ''])
  assert.ok(!backend.events.includes('find-duplicate'))
})

test('distinct submissions append rows without a submission ID column', () => {
  const backend = createBackend({ properties: { SHEET_NAME: 'Gym Leads' } })
  assert.equal(backend.submit().ok, true)
  assert.equal(backend.submit({ ...validSubmission, submissionId: 'bd166c04-e1db-4cfc-8e11-e01d491e4e46' }).ok, true)
  assert.equal(backend.rows.length, 3)
  assert.equal(backend.rows[2].length, 5)
  assert.deepEqual(backend.events.slice(-6), ['lock', 'open', 'text-format', 'write', 'flush', 'release'])
})

test('spreadsheet formula strings are escaped and phone numbers remain text', () => {
  const backend = createBackend()
  assert.equal(backend.submit({ ...validSubmission, name: '=SUM(1,2)', gymName: '  @SUM(1,2)  ', phone: '0123456789' }).ok, true)
  assert.equal(backend.rows[1][1], "'=SUM(1,2)")
  assert.equal(backend.rows[1][2], '0123456789')
  assert.equal(backend.rows[1][4], "'@SUM(1,2)")
  assert.ok(backend.events.indexOf('text-format') < backend.events.indexOf('write'))
})

test('busy backends fail and an empty property falls back to the configured spreadsheet ID', () => {
  const busy = createBackend({ busy: true })
  assert.equal(busy.submit().ok, false)
  assert.deepEqual(busy.events, ['busy'])
  const unconfigured = createBackend({ properties: { SPREADSHEET_ID: '' } })
  assert.equal(unconfigured.submit().ok, true)
  assert.equal(unconfigured.events[1], 'open')
})

test('write failures release the lock and keep internal details out of the response', () => {
  const backend = createBackend({ failWrite: true })
  const result = backend.submit()
  assert.equal(result.ok, false)
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE_SHEET_ID|PII/)
  assert.equal(backend.events.at(-1), 'release')
  assert.ok(!backend.events.includes('flush'))
})

test('refuses to append data to an existing sheet with unexpected columns', () => {
  const backend = createBackend({ sheetExists: true, rows: [['Existing', 'Different', 'Columns']] })
  assert.equal(backend.submit().ok, false)
  assert.equal(backend.rows.length, 1)
  assert.deepEqual(backend.events, ['lock', 'open', 'release'])
})
