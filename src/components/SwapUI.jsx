import React, { useState } from 'react'
import TokenContract from './TokenContract'

export default function SwapUI(){
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [fromAmt, setFromAmt] = useState('')

  function doSwap(){
    alert('Swap placeholder — integrate quoting & swap logic (0x/1inch) here')
  }

  return (
    <div>
      <div className="input-box">
        <input placeholder="From (symbol or address)" value={from} onChange={e=>setFrom(e.target.value)} />
        <input placeholder="Amount" value={fromAmt} onChange={e=>setFromAmt(e.target.value)} />
      </div>
      <div className="input-box">
        <input placeholder="To (symbol or address)" value={to} onChange={e=>setTo(e.target.value)} />
      </div>
      <div className="controls">
        <button className="glassy-btn" onClick={doSwap}>Swap</button>
      </div>

      <div style={{marginTop:16}}>
        <TokenContract />
      </div>
    </div>
  )
}
