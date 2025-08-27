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
    // Try multiple possible paths for the dist folder
    const possiblePaths = [
      path.join(__dirname, '../../dist'),
      path.join(__dirname, '../dist'),
      path.join(__dirname, 'dist'),
      path.join(process.cwd(), 'dist')
    ];
    
    let distPath = null;
    for (const p of possiblePaths) {
      try {
        require('fs').accessSync(p);
        distPath = p;
        break;
      } catch (e) {
        // Path doesn't exist, try next one
      }
    }
    
    if (distPath) {
      console.log(`Serving static files from: ${distPath}`);
      app.use(express.static(distPath));
      
      // Handle React routing, return all requests to React app
      // Use a more specific pattern to avoid path-to-regexp issues
      app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.error('Could not find dist folder. Available paths tried:', possiblePaths);
      // Fallback: serve a simple message
      app.get(/^(?!\/api).*/, (req, res) => {
        res.status(404).json({ 
          ok: false, 
          error: 'Frontend not built. Please check build process.',
          availablePaths: possiblePaths
        });
      });
    }
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
