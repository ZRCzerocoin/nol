import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ENV } from './utils/constants'
import { ethers } from 'ethers'

// Default export — your main React App
export default function App(){
  // Supabase setup (reads from env vars)
  const supabaseUrl = ENV.SUPABASE_URL
  const supabaseKey = ENV.SUPABASE_KEY
  const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null

  // UI state
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [chatText, setChatText] = useState('')
  const [username, setUsername] = useState(localStorage.getItem('chatUser') || '')
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [connectedAddress, setConnectedAddress] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const msgRef = useRef(null)

  // restore username
  useEffect(()=>{ if(username) localStorage.setItem('chatUser', username); }, [username])

  // chat: load history once
  useEffect(()=>{
    let mounted = true
    async function load(){
      if(!supabase) return
      try{
        const { data, error } = await supabase.from('chat_messages').select('id,user,text,created_at').order('id',{ascending:true}).limit(200)
        if(!error && mounted){ setMessages(data || []) }
      }catch(e){ console.warn('chat load', e) }
    }
    load()
    return ()=>{ mounted=false }
  }, [supabase])

  // chat: simple polling for new messages (lightweight)
  useEffect(()=>{
    if(!supabase) return
    let lastId = messages.length ? messages[messages.length-1].id : 0
    const timer = setInterval(async ()=>{
      try{
        const { data } = await supabase.from('chat_messages').select('id,user,text,created_at').gt('id', lastId).order('id',{ascending:true})
        if(data && data.length){
          lastId = data[data.length-1].id
          setMessages(prev=>[...prev, ...data])
        }
      }catch(e){ console.warn('poll', e) }
    }, 1200)
    return ()=>clearInterval(timer)
  }, [supabase, messages.length])

  useEffect(()=>{ if(msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight }, [messages])

  async function sendChat(){
    if(!chatText || !username) return
    if(!supabase) { alert('Supabase not configured in .env'); return }
    try{
      const { data, error } = await supabase.from('chat_messages').insert({ user: username, text: chatText })
      if(!error){ setMessages(prev=>[...prev, data[0]]); setChatText('') }
    }catch(e){ console.error(e) }
  }

  // Wallet connect basic
  async function connectWallet(){
    try{
      setIsConnecting(true)
      if(window.ethereum){
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const p = new ethers.BrowserProvider(window.ethereum)
        const signer = await p.getSigner()
        const addr = await signer.getAddress()
        setConnectedAddress(addr)
        showToast('Connected: ' + addr)
      } else {
        showToast('No injected wallet found. Use WalletConnect via AppKit (configure project id).')
      }
    }catch(e){ console.error(e); showToast('Connect failed') }
    finally{ setIsConnecting(false) }
  }

  function swapTokens(){
    showToast('Swap placeholder — integrate your quote/bridge logic here')
  }

  // simple toast impl
  function showToast(msg){
    // small ephemeral toast using DOM
    const el = document.createElement('div')
    el.className = 'toast'
    el.textContent = msg
    document.body.appendChild(el)
    setTimeout(()=> el.style.opacity = '1', 20)
    setTimeout(()=>{ el.style.opacity = '0'; setTimeout(()=>el.remove(), 300) }, 3000)
  }

  return (
    <div className="app-root">
      <img className="logo" src="/logo.gif" alt="NOLA" />

      <div className="top-right-connect">
        <div className="addr-chip">{connectedAddress ? `${connectedAddress.slice(0,6)}...${connectedAddress.slice(-4)}` : ''}</div>
        <button className={`connect-floating ${connectedAddress? 'connected':''}`} onClick={connectWallet} disabled={isConnecting} aria-haspopup>
          {connectedAddress ? 'Connected' : (isConnecting? 'Connecting...' : 'Connect Wallet')}
        </button>
      </div>

      <main className="section-wrapper">
        <div className="container">
          <h2>NOLA Exchange</h2>

          <div className="input-box" style={{position:'relative'}}>
            <div className="left">
              <div className="token-icon"><img alt="from" src="/placeholder-token.svg"/></div>
              <div className="input-field">
                <input value={fromToken} onChange={e=>setFromToken(e.target.value)} placeholder="symbol or address" />
              </div>
              <div className="input-amount"><input value={fromAmount} onChange={e=>setFromAmount(e.target.value)} type="number"/></div>
            </div>
          </div>

          <div className="input-box" style={{position:'relative', marginTop:12}}>
            <div className="left">
              <div className="token-icon"><img alt="to" src="/placeholder-token.svg"/></div>
              <div className="input-field"><input value={toToken} onChange={e=>setToToken(e.target.value)} placeholder="symbol or address" /></div>
              <div className="input-amount"><input value={toAmount} readOnly placeholder="Estimate"/></div>
            </div>
          </div>

          <div className="controls" style={{marginTop:14}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div id="swapOutside" className="swap-outside" title="Swap From ↔ To" onClick={()=>{ const a=fromToken; setFromToken(toToken); setToToken(a); }}>
                ⇅
              </div>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div className="slippage-wrap" aria-label="Slippage">
                <div className="slippage-display"><span>1%</span></div>
              </div>
            </div>
          </div>

          <div className="swap-row" style={{marginTop:8}}>
            <button id="swapBtn" className="glassy-btn" onClick={swapTokens}>
              <span className="icon">⇄</span>
              <span className="label">Swap</span>
            </button>
          </div>

          <div style={{display:'flex',justifyContent:'flex-end',marginTop:10}}>
            <button className="quick-cta">Quick Swap</button>
          </div>

        </div>
      </main>

      <div className="chat-toggle" onClick={()=>setChatOpen(v=>!v)}>Public Chat🔘</div>

      <aside className={`chat-sidebar ${chatOpen? 'open':''}`}>
        <h3 style={{textAlign:'center',marginBottom:10}}>Chat</h3>
        <div id="chatMessages" ref={msgRef} style={{overflowY:'auto', flex:1}}>
          {messages.length===0 && <div style={{opacity:0.7,textAlign:'center',marginTop:20}}>No messages yet — be first!</div>}
          {messages.map(m => (
            <div key={m.id} className="chat-msg">
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <b style={{fontWeight:800}}>{m.user}</b>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginLeft:'auto'}}>{new Date(m.created_at).toLocaleTimeString?.()}</span>
              </div>
              <div style={{marginTop:6,whiteSpace:'pre-wrap'}}>{m.text}</div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input value={chatText} onChange={e=>setChatText(e.target.value)} placeholder="Drop your alpha..." />
          <button onClick={sendChat}>NOLA</button>
        </div>
      </aside>

      <footer className="footer">
        <div>© 2025 NOLA — All rights reserved</div>
      </footer>
    </div>
  )
}
