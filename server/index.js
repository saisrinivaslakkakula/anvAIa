import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';


export function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', apiRouter);
  app.use((req, res) => res.status(404).json({ ok: false, error: 'Not Found' }));

  app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    const payload = { ok: false, error: err.message || 'Server error' };
    if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;
    res.status(status).json(payload);
  });

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 4000;
  buildApp().listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}
