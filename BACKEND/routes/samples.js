import express from 'express';
import { supabase } from '../supabaseClient.js'
const router = express.Router();

router.get('/:wellId', async (req, res) => {
  const { wellId } = req.params;
  const { value, error } = await supabase.from('samples').select('*').eq('well_id', wellId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(value);
});
 
router.post('/', async (req, res) => {
  const newSample = req.body;
  const { data, error } = await supabase.from('samples').insert([newSample]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;