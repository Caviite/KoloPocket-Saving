import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import  AuthProvider  from './Context/authprovider';
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

// Capture the install prompt before React mounts to avoid the race condition
window.deferredPrompt = null
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.deferredPrompt = e
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <GoogleOAuthProvider clientId="230605703546-7b609fdmefa18a4qdimetq36pi1gltst.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </AuthProvider>
    </Router>
  </StrictMode >
)