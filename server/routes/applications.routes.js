import express from 'express';
import { ApplicationsService } from '../services/applications.service.js';

const router = express.Router();

/* --------- Applications --------- */
router.get('/', async (req, res) => {
  const { status } = req.query;
  try {
    const applications = await ApplicationsService.getApplications(status);
    res.json(applications);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

router.post('/', async (req, res) => {
  try {
    const application = await ApplicationsService.createApplication(req.body);
    res.json({ ok: true, application });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e) });
  }
});

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { status, notes } = req.body || {};
  if (!id) return res.status(400).json({ ok: false, error: 'Invalid id' });
  try {
    const updated = await ApplicationsService.updateApplication(id, { status, notes });
    res.json({ ok: true, application: updated });
  } catch (e) {
    const msg = String(e);
    res.status(/not found/i.test(msg) ? 404 : 500).json({ ok: false, error: msg });
  }
});

// mock: apply next batch (change statuses randomly; maybe create a question)
router.post('/apply-next-batch', async (req, res) => {
  const limit = Number(req.body?.limit || 20);
  try {
    const results = await ApplicationsService.processBatch(limit);
    res.json({ ok: true, results });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;
