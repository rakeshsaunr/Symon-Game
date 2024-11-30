import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import for React 18
import SimonSays from './SimonSays';
import './index.css';

// Use createRoot for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));  
root.render(
  <React.StrictMode>
    <SimonSays />
  </React.StrictMode>
);
