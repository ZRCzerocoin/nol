import React from 'react'
import ConnectButton from './components/ConnectButton'
import Chat from './components/Chat'
import SwapUI from './components/SwapUI'

export default function App(){
  return (
    <div className="app-root">
      <header className="topbar">
        <img src="/logo.gif" alt="NOLA" className="logo" />
        <div className="top-actions">
          <ConnectButton />
        </div>
      </header>

      <main className="section-wrapper">
        <div className="container">
          <h2>NOLA Exchange</h2>
          <SwapUI />
        </div>
      </main>

      <Chat />

      <footer className="footer">© 2025 NOLA — All rights reserved</footer>
    </div>
  )
}
