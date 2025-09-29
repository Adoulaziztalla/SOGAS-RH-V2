import { buildApp } from './app';

/**
 * Main entry point for the SOGAS-RH backend API
 * Starts the Express server on the configured port
 */

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const app = buildApp();

    const server = app.listen(PORT, () => {
      console.log(`✅ SOGAS-RH Backend API running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth routes: http://localhost:${PORT}/auth`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();