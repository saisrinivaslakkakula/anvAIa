import express from 'express';
import { AgentsService } from '../services/agents.service.js';
import { ApplicationsService } from '../services/applications.service.js';

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

// applier: delegate to batch endpoint logic (proper implementation)
router.post('/run-applier', async (req, res) => {
  try {
    const limit = Number(req.body?.limit || 20);
    const results = await ApplicationsService.processBatch(limit);
    res.json({ ok: true, results });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
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
