import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* 👉 ครอบ App ด้วย AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);
