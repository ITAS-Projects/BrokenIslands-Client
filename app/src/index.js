import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "@descope/react-sdk";

const DescopeID = process.env.REACT_APP_DESCOP_PROJECT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider projectId={DescopeID}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
