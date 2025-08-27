import express from 'express';
import { QuestionsService } from '../services/questions.service.js';

const router = express.Router();

/* --------- Questions --------- */
router.get('/', async (req, res) => {
  const { status } = req.query;
  try {
    const questions = await QuestionsService.getQuestions(status);
    res.json(questions);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { answer } = req.body || {};
  if (!id) return res.status(400).json({ ok: false, error: 'Invalid id' });
  if (typeof answer !== 'string' || !answer.trim()) {
    return res.status(400).json({ ok: false, error: 'Answer required' });
  }

  try {
    const out = await QuestionsService.answerQuestion(id, answer);
    res.json({ ok: true, ...out });
  } catch (e) {
    const msg = String(e);
    res.status(/not found/i.test(msg) ? 404 : 500).json({ ok: false, error: msg });
  }
});

router.post('/create', async (req, res) => {
  try {
    const question = await QuestionsService.createQuestion(req.body);
    res.json({ ok: true, question });
  } catch (e) {
    const msg = String(e);
    // map friendly errors
    if (/NotFound: job/i.test(msg)) return res.status(404).json({ ok: false, error: msg });
    if (/NotFound: application/i.test(msg)) return res.status(404).json({ ok: false, error: msg });
    if (/BadRequest:/i.test(msg)) return res.status(400).json({ ok: false, error: msg.replace('BadRequest: ','') });

    // default
    res.status(500).json({ ok: false, error: msg });
  }
});

export default router;
