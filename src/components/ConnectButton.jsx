import React from 'react'
import { useAppKit } from '@reown/appkit/react'

export default function ConnectButton(){
  const { open, connect, disconnect } = useAppKit();
  return (
    <div className="wallet-connect-wrapper">
      <button className="connect-btn" onClick={() => connect()}>Connect Wallet</button>
      <button className="connect-nd-btn" onClick={() => open({ view: 'Networks' })}>Networks</button>
      <button className="connect-nd-btn" onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}(){
  const { open } = useAppKit()
  return (
    <div>
      <button className="connect-btn" onClick={() => open()}>Connect Wallet</button>
      <button className="connect-nd-btn" onClick={() => open({ view: 'Networks' })}>Networks</button>
    </div>
  )
}
