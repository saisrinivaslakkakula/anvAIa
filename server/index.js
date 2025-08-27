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
      
      // Fallback: serve a simple HTML page with basic functionality
      app.get(/^(?!\/api).*/, (req, res) => {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Agents - Frontend Building</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow-md p-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-4">🚀 Job Agents Application</h1>
                <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                    <p class="text-blue-800">
                        <strong>Status:</strong> Frontend is currently building. This is a temporary page.
                    </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h2 class="text-xl font-semibold mb-2">✅ Backend Status</h2>
                        <p class="text-gray-600">Your backend API is working perfectly!</p>
                        <a href="/api/health" class="text-blue-600 hover:underline">Test API Health</a>
                    </div>
                    
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h2 class="text-xl font-semibold mb-2">🔧 Frontend Status</h2>
                        <p class="text-gray-600">React app is being built. This may take a few minutes.</p>
                    </div>
                </div>
                
                <div class="border-t pt-6">
                    <h3 class="text-lg font-semibold mb-3">Available API Endpoints:</h3>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li>• <code class="bg-gray-100 px-2 py-1 rounded">GET /api/health</code> - Health check</li>
                        <li>• <code class="bg-gray-100 px-2 py-1 rounded">GET /api/jobs</code> - List jobs</li>
                        <li>• <code class="bg-gray-100 px-2 py-1 rounded">GET /api/applications</code> - List applications</li>
                        <li>• <code class="bg-gray-100 px-2 py-1 rounded">GET /api/questions</code> - List questions</li>
                    </ul>
                </div>
                
                <div class="mt-6 text-center">
                    <button onclick="location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        🔄 Refresh Page
                    </button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
        
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
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
