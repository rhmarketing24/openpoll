import { useEffect, useState } from 'react';
export default function PollPage() {
  const [poll, setPoll] = useState(null);
  useEffect(()=> {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;
    fetch(`/api/polls/${id}`).then(r=>r.json()).then(d=>setPoll(d.poll));
  }, []);
  if(!poll) return <div>Loading...</div>;
  return (
    <div style={{padding:20}}>
      <h2>{poll.title}</h2>
      <ul>
        {poll.options.map((o,i)=>(
          <li key={i}>{o.label}</li>
        ))}
      </ul>
    </div>
  );
}
