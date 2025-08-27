import express from 'express';
import { AgentsService } from '../services/agents.service.js';

const router = express.Router();

/* --------- Agents --------- */
// researcher mock: add a few jobs and log run
router.post('/run-researcher', async (_req, res) => {
  try {
    const added = await AgentsService.runResearcher();
    res.json({ ok: true, added });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// applier: delegate to batch endpoint logic (simple proxy)
router.post('/run-applier', async (req, res) => {
  // just call the handler above (keep shape same for smoke script)
  req.url = '/api/applications/apply-next-batch';
  req.app._router.handle(req, res);
});

router.get('/runs', async (_req, res) => {
  try {
    const runs = await AgentsService.getRuns();
    res.json(runs);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;
