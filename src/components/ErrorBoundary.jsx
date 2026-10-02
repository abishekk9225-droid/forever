import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Visual/Audio Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Silently fall back to rendering nothing (for decorative elements)
      // or return the specified fallback UI
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}
