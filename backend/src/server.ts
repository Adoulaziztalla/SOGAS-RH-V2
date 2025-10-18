import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('==========================================');
  console.log('🚀 SOGAS-RH Backend V2.0');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/auth`);
  console.log('==========================================');
});

// Graceful shutdown
const shutdown = async () => {
  console.log('\n🛑 Shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('❌ Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);