import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import ErrorBoundary from './components/shared/ErrorBoundary'
import { EventFormProvider } from './contexts/EventFormContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <EventFormProvider>
        <App />
        <Toaster />
      </EventFormProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
