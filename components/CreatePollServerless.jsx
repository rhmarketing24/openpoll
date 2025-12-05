import { useState } from 'react';
import { ethers } from 'ethers';
export default function CreatePollServerless(){
  const [title,setTitle]=useState(''); const [options,setOptions]=useState(['','']);
  function add(){ setOptions([...options,'']); }
  function setOpt(i,v){ const a=[...options]; a[i]=v; setOptions(a); }
  async function createPoll(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    const payload = JSON.stringify({ title, options: options.filter(o=>o.trim()).map(o=>({label:o})), ts:Date.now() });
    const signature = await signer.signMessage(payload);
    const res = await fetch('/api/polls/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({payload,signature,creator:addr})});
    const d=await res.json();
    if(d.ok){
      const url = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/poll?id=${d.poll.id}`;
      try{ window.navigator.clipboard.writeText(url); alert('Poll created and URL copied'); } catch(e){ alert('Poll created'); }
    } else alert('Create failed');
  }
  return (<div style={{padding:20}}>
    <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
    {options.map((o,i)=>(<div key={i}><input value={o} onChange={e=>setOpt(i,e.target.value)} placeholder={`Option ${i+1}`} /></div>))}
    <button onClick={add}>Add option</button>
    <button onClick={createPoll}>Create & Copy URL</button>
  </div>);
}
