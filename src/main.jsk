import { AppKitProvider } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { ethers } from 'ethers'

function Root() {
  // create a safe adapter factory that only runs in browser
  let adapter = null
  try {
    if (typeof window !== 'undefined') {
      const provider = (window.ethereum) ? new ethers.BrowserProvider(window.ethereum) : null
      adapter = provider ? new EthersAdapter({ provider }) : null
    }
  } catch (e) {
    console.warn('AppKit adapter init failed', e)
  }

  // project id is kept as env name the same you used before
  const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || ''

  // If AppKit is not present or adapter not configured, App will still run (fallback UI)
  if (adapter) {
    return (
      <AppKitProvider projectId={projectId} adapter={adapter}>
        <App />
      </AppKitProvider>
    )
  }

  return <App />
}

createRoot(document.getElementById('root')).render(<Root />)
