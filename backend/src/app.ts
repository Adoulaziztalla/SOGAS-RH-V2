import express from 'express';
import { buildAuthRoutes } from './routes/auth.routes';
import { buildPrismaAuthService } from './repos/auth.prisma.store';

/**
 * Builds and configures the Express application.
 * Quick check: Used by src/server.ts to start the HTTP server.
 */
export function buildApp() {
  const app = express();

  // Parse JSON request bodies
  app.use(express.json());

  // Initialize Prisma-backed auth service
  const authService = buildPrismaAuthService();

  // Mount authentication routes
  app.use('/auth', buildAuthRoutes({ authService }));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  return app;
}