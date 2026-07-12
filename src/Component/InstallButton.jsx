import { useEffect, useState } from 'react'
import './InstallButton.css'

export default function InstallButton() {
  const [promptEvent, setPromptEvent] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault()
      window.deferredPrompt = event
      setPromptEvent(event)
    }

    const appInstalled = () => {
      setIsInstalled(true)
      alert('KoloPocket installed')
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', appInstalled)
    if (window.deferredPrompt) {
      setPromptEvent(window.deferredPrompt)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', appInstalled)
    }
  }, [])

  const handleInstall = async () => {
    const prompt = promptEvent || window.deferredPrompt
    if (!prompt) {
      alert('Install prompt is not available on this browser. Use your browser menu to install.')
      return
    }

    alert('Installing KoloPocket')
    prompt.prompt()

    try {
      const choiceResult = await promptEvent.userChoice
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true)
        alert('KoloPocket installed')
      } else {
        alert('KoloPocket installation canceled')
      }
    } catch (err) {
      alert('Installation failed. Please try again.')
    } finally {
      setPromptEvent(null)
      window.deferredPrompt = null
    }
  }

  if (isInstalled) return null

  return (
    <div className="install-card">
      <button className="install-button" onClick={handleInstall}>
        Install KoloPocket
      </button>
    </div>
  )
}
