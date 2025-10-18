import express from 'express';
import cors from 'cors';
import { buildAuthRoutes } from './routes/auth.routes.js';
import { buildEmployeesRoutes } from './routes/employees.routes.js';


const app = express();

// Middlewares de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Routes Auth
app.use('/auth', buildAuthRoutes());
app.use('/api/employees', buildEmployeesRoutes());

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route non trouvée',
    },
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erreur serveur',
    },
  });
});

export default app;