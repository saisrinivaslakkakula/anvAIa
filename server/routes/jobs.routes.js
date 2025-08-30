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

// create a single job
router.post('/', async (req, res) => {
  try {
    const job = await JobsService.createJob(req.body);
    res.status(201).json({ ok: true, job });
  } catch (e) {
    const errorMessage = String(e);
    if (errorMessage.includes('Missing required fields')) {
      res.status(400).json({ ok: false, error: errorMessage });
    } else if (errorMessage.includes('already exists')) {
      res.status(409).json({ ok: false, error: errorMessage });
    } else {
      res.status(500).json({ ok: false, error: errorMessage });
    }
  }
});

export default router;
