import supabaseAdmin from '../../../../lib/supabaseServer';
import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { payload, signature, voter, optionIndex } = req.body;

    if (!payload || !signature || !voter || optionIndex === undefined)
      return res.status(400).json({ error: 'missing' });

    const recovered = ethers.verifyMessage(payload, signature);

    if (recovered.toLowerCase() !== voter.toLowerCase())
      return res.status(401).json({ error: 'signature mismatch' });

    const pollId = req.query.id;

    const { data, error } = await supabaseAdmin
      .from('votes')
      .insert({
        poll_id: pollId,
        voter_address: voter,
        option_index: optionIndex,
      })
      .select()
      .single();

    if (error) throw error;

    return res.json({ ok: true, vote: data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
