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

// Test POST endpoint to check if POST requests are working
router.post('/', async (req, res) => {
  console.log('Health POST endpoint hit!');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT NOW() as ts`;
    res.json({ 
      ok: true, 
      message: 'Health POST endpoint working!',
      ts: new Date().toISOString(),
      receivedData: req.body,
      headers: req.headers,
      method: req.method,
      url: req.url
    });
  } catch (e) {
    res.status(500).json({ 
      ok: false, 
      error: String(e),
      message: 'Health POST endpoint hit but DB failed',
      receivedData: req.body,
      headers: req.headers,
      method: req.method,
      url: req.url
    });
  }
});

export default router;
