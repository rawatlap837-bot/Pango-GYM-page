import { useEffect, useRef, useState } from 'react'
import { createSubmissionId, submitRegistration, validateRegistration } from '../lib/registration'
import './RegistrationPopup.css'

const EMPTY_VALUES = { name: '', phone: '', email: '', gymName: '', website: '' }
const FIELD_NAMES = ['name', 'phone', 'email', 'gymName']
const PAYMENT_URL = 'https://rzp.io/rzp/LnYf71MV'

export default function RegistrationPopup({ onClose }) {
  const dialogRef = useRef(null)
  const formRef = useRef(null)
  const nameRef = useRef(null)
  const headingRef = useRef(null)
  const mountedRef = useRef(false)
  const inFlightRef = useRef(false)
  const submissionRef = useRef({ fingerprint: '', id: '' })
  const [values, setValues] = useState(EMPTY_VALUES)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const isSubmitting = status === 'submitting'
  const isSuccess = status === 'success'

  useEffect(() => {
    mountedRef.current = true
    const dialog = dialogRef.current
    const opener = document.activeElement
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    if (scrollbarWidth > 0) {
      const padding = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0
      document.body.style.paddingRight = `${padding + scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    nameRef.current?.focus({ preventScroll: true })

    return () => {
      mountedRef.current = false
      dialog.close()
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      if (opener instanceof HTMLElement && opener.isConnected) {
        opener.focus({ preventScroll: true })
      }
    }
  }, [])

  useEffect(() => {
    if (isSuccess) headingRef.current?.focus({ preventScroll: true })
  }, [isSuccess])

  const close = () => {
    if (!inFlightRef.current) onClose()
  }

  const changeField = (event) => {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: undefined }))
    setMessage('')
  }

  const blurField = (event) => {
    const { name } = event.target
    if (!values[name].trim() && !errors[name]) return
    const nextErrors = validateRegistration(values)
    setErrors((previous) => ({ ...previous, [name]: nextErrors[name] }))
  }

  const focusInvalidField = (fieldErrors) => {
    const firstField = FIELD_NAMES.find((name) => fieldErrors[name])
    if (firstField) formRef.current?.elements.namedItem(firstField)?.focus()
  }

  const submit = async (event) => {
    event.preventDefault()
    if (inFlightRef.current) return

    const nextErrors = validateRegistration(values)
    setErrors(nextErrors)
    setMessage('')
    if (Object.keys(nextErrors).length > 0) {
      focusInvalidField(nextErrors)
      return
    }

    inFlightRef.current = true
    setStatus('submitting')

    try {
      // Keep the same ID on a retry so a delayed response cannot create two entries.
      const fingerprint = JSON.stringify(values)
      if (submissionRef.current.fingerprint !== fingerprint) {
        submissionRef.current = { fingerprint, id: createSubmissionId() }
      }
      const result = await submitRegistration({
        ...values,
        submissionId: submissionRef.current.id,
      })
      if (result?.ok !== true) {
        throw new Error('We couldn’t submit your details. Please try again.')
      }
      window.location.assign(PAYMENT_URL)
    } catch (error) {
      if (!mountedRef.current) return
      const fieldErrors = Object.fromEntries(
        FIELD_NAMES.filter((name) => error?.fieldErrors?.[name]).map((name) => [name, error.fieldErrors[name]]),
      )
      setErrors(fieldErrors)
      setMessage(error?.message || 'We couldn’t submit your details. Please try again.')
      setStatus('idle')
      if (Object.keys(fieldErrors).length) {
        // Wait for React to re-enable the fields before moving focus to an error.
        window.requestAnimationFrame(() => {
          if (mountedRef.current) focusInvalidField(fieldErrors)
        })
      }
    } finally {
      inFlightRef.current = false
    }
  }

  const fieldProps = (name) => ({
    id: `registration-${name}`,
    name,
    value: values[name],
    onChange: changeField,
    onBlur: blurField,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `registration-${name}-error` : undefined,
  })

  return (
    <dialog
      ref={dialogRef}
      id="registration-dialog"
      className="registration-dialog"
      aria-labelledby="registration-title"
      aria-describedby="registration-description"
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close()
      }}
    >
      <div className="registration-card">
        <header className="registration-header">
          <button
            className="registration-close"
            type="button"
            aria-label="Close registration form"
            onClick={close}
            disabled={isSubmitting}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <span className="registration-eyebrow">Gym Growth Call</span>
          <h2 id="registration-title" ref={headingRef} tabIndex={isSuccess ? -1 : undefined}>
            {isSuccess ? 'Details received!' : 'Let’s grow your gym'}
          </h2>
          <p id="registration-description">
            {isSuccess
              ? 'Your details have been submitted successfully.'
              : 'Share your details to take the next step.'}
          </p>
        </header>

        {isSuccess ? (
          <div className="registration-success">
            <span className="registration-success-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="34" height="34" fill="none">
                <path d="m8 16 5 5L24 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p>Thank you, <strong>{values.name.trim().split(/\s+/)[0]}</strong>. We’ve received your gym growth call registration details.</p>
            <button className="registration-submit" type="button" onClick={close}>Done</button>
          </div>
        ) : (
          <form className="registration-form" ref={formRef} onSubmit={submit} noValidate aria-busy={isSubmitting}>
            <p className="registration-required-note">Fields marked <span aria-hidden="true">*</span> are required.</p>
            <fieldset className="registration-fields" disabled={isSubmitting}>
              <div className="registration-field">
                <label htmlFor="registration-name">Full name <span className="registration-required" aria-hidden="true">*</span></label>
                <input {...fieldProps('name')} ref={nameRef} type="text" autoComplete="name" placeholder="Your full name" maxLength={80} required />
                {errors.name && <p className="registration-field-error" id="registration-name-error">{errors.name}</p>}
              </div>

              <div className="registration-field">
                <label htmlFor="registration-phone">Phone number <span className="registration-required" aria-hidden="true">*</span></label>
                <input {...fieldProps('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="Your phone number" maxLength={30} required />
                {errors.phone && <p className="registration-field-error" id="registration-phone-error">{errors.phone}</p>}
              </div>

              <div className="registration-field">
                <label htmlFor="registration-email">Email address <span className="registration-required" aria-hidden="true">*</span></label>
                <input {...fieldProps('email')} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@example.com" maxLength={254} required />
                {errors.email && <p className="registration-field-error" id="registration-email-error">{errors.email}</p>}
              </div>

              <div className="registration-field">
                <label htmlFor="registration-gymName">Gym name <span className="registration-optional">Optional</span></label>
                <input {...fieldProps('gymName')} type="text" autoComplete="organization" placeholder="Your gym’s name" maxLength={120} />
                {errors.gymName && <p className="registration-field-error" id="registration-gymName-error">{errors.gymName}</p>}
              </div>

              <div className="registration-honeypot" aria-hidden="true">
                <label htmlFor="registration-website">Website</label>
                <input id="registration-website" name="website" value={values.website} onChange={changeField} tabIndex={-1} autoComplete="off" maxLength={200} />
              </div>
            </fieldset>

            {message && <p className="registration-form-error" role="alert">{message}</p>}
            <button className="registration-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting && <span className="registration-spinner" aria-hidden="true" />}
              {isSubmitting ? 'Submitting…' : 'Submit details'}
            </button>
            <p className="registration-progress" role="status" aria-live="polite">
              {isSubmitting ? 'Please wait while we save your details.' : ''}
            </p>
          </form>
        )}
      </div>
    </dialog>
  )
}
