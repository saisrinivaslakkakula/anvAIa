import express from 'express';
import healthRoutes from './health.routes.js';
import jobsRoutes from './jobs.routes.js';
import applicationsRoutes from './applications.routes.js';
import questionsRoutes from './questions.routes.js';
import agentsRoutes from './agents.routes.js';

const router = express.Router();

// Mount all route modules under /api
router.use('/health', healthRoutes);
router.use('/jobs', jobsRoutes);
router.use('/applications', applicationsRoutes);
router.use('/questions', questionsRoutes);
router.use('/agents', agentsRoutes);

export default router;
