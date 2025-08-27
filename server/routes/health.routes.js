import express from 'express';
import { prisma } from '../prismaClient.js';

const router = express.Router();

/* --------- Health --------- */
router.get('/', async (_req, res) => {
  try {
    // Test database connection with a simple query
    await prisma.$queryRaw`SELECT NOW() as ts`;
    res.json({ ok: true, ts: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;
