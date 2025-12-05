import supabaseAdmin from '../../../../lib/supabaseServer';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const { id } = req.query;
    const { data: poll, error } = await supabaseAdmin
      .from('polls')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    const { data: counts } = await supabaseAdmin
      .from('votes')
      .select('option_index, count:count(*)')
      .eq('poll_id', id)
      .group('option_index');

    return res.json({ poll, counts: counts || [] });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
