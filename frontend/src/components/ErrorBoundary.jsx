import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("ChainScope error boundary:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="rounded-2xl border border-bad/40 bg-panel p-6">
          <h2 className="mb-2 text-bad">something broke</h2>
          <pre className="overflow-auto text-xs text-muted">
            {String(this.state.error?.stack || this.state.error)}
          </pre>
          <button
            className="mt-3 rounded border border-border px-3 py-1 text-sm"
            onClick={() => this.setState({ error: null })}
          >
            retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
