// routes/wells.js
import express from 'express';
import { supabase } from '../supabaseClient.js';
const router = express.Router();

// GET all wells
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('wells').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET a single well by ID
router.get('/:wellId', async (req, res) => {
  const { wellId } = req.params;
  const { data, error } = await supabase.from('wells').select('*').eq('well_id', wellId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
