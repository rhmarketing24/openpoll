import supabaseAdmin from '../../../lib/supabaseServer';
import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { payload, signature, creator } = req.body;

    if (!payload || !signature || !creator)
      return res.status(400).json({ error: 'missing' });

    const recovered = ethers.verifyMessage(payload, signature);

    if (recovered.toLowerCase() !== creator.toLowerCase())
      return res.status(401).json({ error: 'signature mismatch' });

    const obj = JSON.parse(payload);
    const { title, description, options, expiresAt } = obj;

    const { data, error } = await supabaseAdmin
      .from('polls')
      .insert({
        creator_address: creator,
        title,
        description: description || null,
        options,
        expires_at: expiresAt || null,
      })
      .select()
      .single();

    if (error) throw error;

    return res.json({ ok: true, poll: data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
