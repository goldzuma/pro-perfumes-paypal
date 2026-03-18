
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

// HMR & WebSocket Logging for Debugging
if (import.meta.hot) {
  import.meta.hot.on('vite:error', (err) => {
    console.error('❌ [HMR] Error:', err);
  });

  import.meta.hot.on('vite:ws:disconnect', () => {
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        // window.location.reload();
      }
    }, 5000);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
