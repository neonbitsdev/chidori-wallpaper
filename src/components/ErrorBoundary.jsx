import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    console.error('Error caught by boundary:', error, errorInfo);
    
    if (window.analytics && window.analytics.trackEvent) {
      window.analytics.trackEvent('error_boundary', {
        category: 'error',
        label: error.message,
        value: 1
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '2rem',
          textAlign: 'center',
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(74, 144, 226, 0.3)',
          borderRadius: '15px',
          margin: '2rem',
          color: '#e0e0e0'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#ff6b6b' }}>
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            color: '#ff6b6b',
            fontFamily: 'Nippo-Bold'
          }}>
            Oops! Something went wrong
          </h2>
          <p style={{ 
            marginBottom: '2rem',
            opacity: 0.8,
            fontFamily: 'Nippo-Regular'
          }}>
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #4a90e2 0%, #1a1a2e 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Nippo-Medium',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(74, 144, 226, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <i className="fa-solid fa-refresh" style={{ marginRight: '8px' }}></i>
            Refresh Page
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <details style={{ 
              marginTop: '2rem', 
              textAlign: 'left',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '8px',
              maxWidth: '600px',
              overflow: 'auto'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                Error Details (Development)
              </summary>
              <pre style={{ 
                fontSize: '0.8rem',
                color: '#ff6b6b',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
