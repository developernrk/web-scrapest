
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './index.css';

// Use createRoot API for React 18
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
