import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  // API routes
  app.use('/api', apiRouter);
  
  // Serve static files from the React build
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../dist')));
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../dist/index.html'));
    });
  } else {
    app.use((req, res) => res.status(404).json({ ok: false, error: 'Not Found' }));
  }

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
