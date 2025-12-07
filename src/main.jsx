import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// AppKit bootstrap (createAppKit) — this runs once on app startup
import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { arbitrum, mainnet } from '@reown/appkit/networks'

// Read env vars
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || ''
const siteName = import.meta.env.VITE_SITE_NAME || 'NOLA Exchange'
const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin

// createAppKit according to your provided framework
try{
  createAppKit({
    adapters: [new EthersAdapter()],
    networks: [arbitrum, mainnet],
    metadata: {
      name: siteName,
      description: `${siteName} — exchange UI`,
      url: siteUrl,
      icons: [siteUrl + '/logo.png']
    },
    projectId,
    features: {
      analytics: true,
      email: true,
      socials: true,
      walletFeatures: {
        // Enable full deep linking
        pushNotifications: true,
        explorerRedirect: true
      }
    },
    // Deep linking config
    walletConnect: {
      deepLink: {
        android: true,
        ios: true
      }
    }
  })
  console.info('AppKit created')
}catch(e){ console.warn('createAppKit failed (ok in dev)', e) }

// Render root
createRoot(document.getElementById('root')).render(
  <App />
)
