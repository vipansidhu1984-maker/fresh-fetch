import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Fresh Fetch App Caught Error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#f8fafc',
          color: '#1e293b',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            background: '#ffffff',
            padding: '2.5rem',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            maxWidth: '480px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#14532d', marginBottom: '0.5rem' }}>
              Fresh Fetch
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              The application encountered a temporary display issue. Click below to refresh and load cleanly.
            </p>
            {this.state.error && (
              <div style={{
                textAlign: 'left',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1.25rem',
                fontSize: '0.8rem',
                color: '#991b1b',
                maxHeight: '120px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error?.toString()}
                {'\n'}
                {this.state.error?.stack}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#15803d',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(21,128,61,0.25)'
                }}
              >
                Reload App
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Reset Storage
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Register PWA Service Worker
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('🌱 Fresh Fetch PWA Service Worker Registered Successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('⚠️ Service Worker Registration Notice:', err);
      });
  });
}


