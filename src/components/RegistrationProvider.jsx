import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import RegistrationContext from '../RegistrationContext'
import RegistrationPopup from './RegistrationPopup'

export default function RegistrationProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <RegistrationContext.Provider value={{ open }}>
      {children}
      {isOpen && createPortal(<RegistrationPopup onClose={close} />, document.body)}
    </RegistrationContext.Provider>
  )
}
