import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import ErrorBoundary from './components/shared/ErrorBoundary'
import { EventFormProvider } from './contexts/EventFormContext'
import { WebsitePagesProvider } from './contexts/WebsitePagesContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <EventFormProvider>
        <WebsitePagesProvider>
          <App />
          <Toaster />
        </WebsitePagesProvider>
      </EventFormProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
