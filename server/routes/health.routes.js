import express from 'express';
import { q } from '../pg.js';

const router = express.Router();

/* --------- Health --------- */
router.get('/', async (_req, res) => {
  try {
    const { rows } = await q('select now() as ts');
    res.json({ ok: true, ts: rows[0].ts });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;
