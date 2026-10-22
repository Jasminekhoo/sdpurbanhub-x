import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * ErrorBoundary — catches unhandled React render errors and shows a safe fallback
 * instead of crashing the entire app.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <ComponentThatMightCrash />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log the error without exposing secrets
    console.error('[ErrorBoundary] Caught render error:', error?.message || error);
    console.error('[ErrorBoundary] Component stack:', info?.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (fallback) return fallback;

      return (
        <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-xl bg-white border border-red-200 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <div>
            <div className="text-sm font-bold text-slate-800 mb-1">
              Something went wrong
            </div>
            <div className="text-xs text-slate-500 max-w-xs">
              {this.state.error?.message || 'An unexpected error occurred in this section.'}
            </div>
          </div>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2864A6] hover:bg-[#1E3C66] text-white text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
