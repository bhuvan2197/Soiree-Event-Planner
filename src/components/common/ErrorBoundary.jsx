import React from 'react';
import { RefreshCw } from 'lucide-react';
import WaxSeal from './WaxSeal';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Soirée Atelier ErrorBoundary caught:", error, errorInfo);
  }

  handleResetState = () => {
    try {
      localStorage.removeItem('soiree_active_event_id');
      // Keep saved events but recover to clean initial state
    } catch (e) {
      console.warn("Could not reset localStorage:", e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-soiree-bg flex items-center justify-center p-6 text-soiree-ink font-sans">
          <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-8 sm:p-10 max-w-lg w-full shadow-luxury text-center space-y-6">
            <div className="flex justify-center">
              <WaxSeal size={56} />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-soiree-burgundyDeep">
                A Moment of Composure
              </h2>
              <p className="text-sm text-soiree-muted leading-relaxed">
                The atelier encountered an unexpected condition while orchestrating your event data. No celebration plans were deleted.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-soiree-sand/40 border border-soiree-sand text-xs text-left font-mono text-soiree-ink/80 overflow-x-auto">
              {this.state.error?.message || "An unexpected error occurred during rendering."}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-soiree-burgundy hover:bg-soiree-burgundyDeep text-[#FAF5EC] text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Atelier</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetState}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-soiree-sand bg-soiree-bg hover:bg-soiree-sand text-xs sm:text-sm font-medium text-soiree-burgundy transition-all flex items-center justify-center gap-2"
              >
                <span>Reset Active Session</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

