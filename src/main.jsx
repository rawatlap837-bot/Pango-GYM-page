import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RegistrationProvider from './components/RegistrationProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RegistrationProvider>
      <App />
    </RegistrationProvider>
  </StrictMode>,
)
