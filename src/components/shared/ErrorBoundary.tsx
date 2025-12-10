import { Component, ErrorInfo, ReactNode } from 'react'
import { logger } from '../../utils/logger'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    logger.error('Error Boundary caught an error:', error)
    logger.error('Error Info:', errorInfo)

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    })

    // You can also log the error to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or use prop fallback
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-10 font-sans">
          <div className="max-w-[600px] rounded-xl bg-white p-10 shadow-lg">
            <div className="mb-6 text-center">
              <div className="mb-4 text-6xl">⚠️</div>
              <h1 className="mb-3 text-2xl font-semibold text-slate-900">
                Oops! Something went wrong
              </h1>
              <p className="text-base text-slate-500">
                We're sorry for the inconvenience. The application encountered an unexpected error.
              </p>
            </div>

            {this.state.error && (
              <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-rose-900">
                  Error Details:
                </h3>
                <p className="break-words font-mono text-xs text-rose-800">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/60"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

