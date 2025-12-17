import express from 'express';
import { supabase } from '../supabaseClient.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const { value, error } = await supabase.from('alerts').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(value);
});

export default router;