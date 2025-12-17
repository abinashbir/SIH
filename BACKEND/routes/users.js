// routes/users.js
import express from 'express';
import { supabase } from '../supabaseClient.js';
const router = express.Router();

// GET all users (restricted by RLS)
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add a new user
router.post('/', async (req, res) => {
  const { email, name, role } = req.body;
  const { data, error } = await supabase.from('users').insert([{ email, name, role }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
