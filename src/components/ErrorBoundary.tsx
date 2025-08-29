import { Component, ReactNode } from 'react';
export default class ErrorBoundary extends Component<{ children: ReactNode }, { err: any }> {
  state = { err: null as any };
  static getDerivedStateFromError(err: any) { return { err }; }
  render() {
    return this.state.err
      ? <pre style={{ whiteSpace: 'pre-wrap', color: 'crimson', padding: 16, background: '#fff3f3' }}>
        {String(this.state.err?.stack || this.state.err)}
      </pre>
      : this.props.children;
  }
}
