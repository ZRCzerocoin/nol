import React, { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY
const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null

export default function Chat(){
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [username, setUsername] = useState(localStorage.getItem('chatUser') || '')
  const msgRef = useRef(null)

  useEffect(()=>{
    if(username) localStorage.setItem('chatUser', username)
  }, [username])

  useEffect(()=>{ if(!supabase) return; loadHistory(); const t = setInterval(fetchNew, 600); return () => clearInterval(t) }, [])

  async function loadHistory(){
    if(!supabase) return
    const { data, error } = await supabase.from('chat_messages').select('id,user,text,created_at').order('id',{ascending:true}).limit(200)
    if(!error && data) setMessages(data)
  }
  let lastId = 0
  async function fetchNew(){
    if(!supabase) return
    const { data } = await supabase.from('chat_messages').select('id,user,text,created_at').gt('id', lastId).order('id',{ascending:true})
    if(data && data.length){ lastId = data[data.length-1].id; setMessages(prev => [...prev, ...data]) }
  }
  useEffect(()=>{ if(msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight }, [messages])

  async function send(){
    if(!text || !username) return
    const { data, error } = await supabase.from('chat_messages').insert({ user: username, text })
    if(!error && data && data[0]) { setMessages(prev=>[...prev, data[0]]); setText('') }
  }

  return (
    <>
      <div className="chat-toggle" onClick={()=>setOpen(v => !v)}>Public Chat</div>
      <aside className={`chat-sidebar ${open? 'open':''}`}>
        <h3>Chat</h3>
        <div className="chat-list" ref={msgRef}>
          {messages.length===0 && <div className="placeholder">No messages yet — be first!</div>}
          {messages.map(m=> <div key={m.id} className="chat-msg"><b>{m.user}</b><div className="text">{m.text}</div></div>)}
        </div>
        <div className="chat-input">
          <input placeholder="Name" value={username} onChange={e=>setUsername(e.target.value)} />
          <input placeholder="Write..." value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send() }} />
          <button onClick={send}>Send</button>
        </div>
      </aside>
    </>
  )
}

