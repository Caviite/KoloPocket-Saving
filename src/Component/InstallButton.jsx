import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import './InstallButton.css'

const isStandaloneMode = () => {
  const displayMode = window.matchMedia ? window.matchMedia('(display-mode: standalone)') : null
  const isStandalone = displayMode ? displayMode.matches : false
  const isIosStandalone = 'standalone' in window.navigator && window.navigator.standalone

  return isStandalone || isIosStandalone
}

export default function InstallButton() {
  const [promptEvent, setPromptEvent] = useState(() => window.deferredPrompt || null)
  const [isInstalled, setIsInstalled] = useState(() => isStandaloneMode())
  const [isDismissed, setIsDismissed] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault()
      window.deferredPrompt = event
      setPromptEvent(event)
    }

    const syncInstalledState = () => {
      setIsInstalled(isStandaloneMode())
    }

    const appInstalled = () => {
      setIsInstalled(true)
    }

    const mediaQuery = window.matchMedia ? window.matchMedia('(display-mode: standalone)') : null

    syncInstalledState()
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', appInstalled)

    if (mediaQuery) {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', syncInstalledState)
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(syncInstalledState)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', appInstalled)

      if (mediaQuery) {
        if (typeof mediaQuery.removeEventListener === 'function') {
          mediaQuery.removeEventListener('change', syncInstalledState)
        } else if (typeof mediaQuery.removeListener === 'function') {
          mediaQuery.removeListener(syncInstalledState)
        }
      }
    }
  }, [])

  const handleInstall = async () => {
    const prompt = promptEvent || window.deferredPrompt
    if (!prompt) {
      return
    }

    setIsInstalling(true)

    try {
      await prompt.prompt()
      const choiceResult = await prompt.userChoice
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true)
      }
    } finally {
      setIsInstalling(false)
      setPromptEvent(null)
      window.deferredPrompt = null
    }
  }

  if (isInstalled || isDismissed) return null

  return (
    <aside className="install-card" aria-label="Install KoloPocket">
      <div className="install-message">
        <span className="install-mark" aria-hidden="true">K</span>
        <div>
          <p className="install-title">Install KoloPocket</p>
          <p className="install-description">Keep your collection close at hand.</p>
        </div>
      </div>
      <button className="install-button" onClick={handleInstall} disabled={isInstalling}>
        {isInstalling ? 'Installing...' : 'Install app'}
      </button>
      <button
        className="install-dismiss"
        onClick={() => setIsDismissed(true)}
        aria-label="Cancel KoloPocket installation"
        title="Cancel"
      >
        <X size={18} strokeWidth={2.25} />
      </button>
    </aside>
  )
}
