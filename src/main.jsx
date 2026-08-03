import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import  AuthProvider  from './Context/authprovider';
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

const savedTheme = localStorage.getItem('kolo_theme') || 'light'
const root = document.documentElement

if (savedTheme === 'dark') {
  root.setAttribute('data-theme', 'dark')
} else if (savedTheme === 'light') {
  root.setAttribute('data-theme', 'light')
} else {
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light')
}

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