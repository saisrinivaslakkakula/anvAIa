import express from 'express';
import { JobsService } from '../services/jobs.service.js';

const router = express.Router();

/* --------- Jobs --------- */
// list jobs (with latest app status per user if you want, but for now simple list)
router.get('/', async (_req, res) => {
  try {
    const jobs = await JobsService.getAllJobs();
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// researcher: import jobs [{...}] with de-dupe on external_link OR internal_id
router.post('/import', async (req, res) => {
  const payload = Array.isArray(req.body) ? req.body : [];
  try {
    const result = await JobsService.importJobs(payload);
    res.json({ ok: true, ...result });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;
