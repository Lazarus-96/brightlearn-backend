/**
 * BrightLearn Backend — Entry Point
 * Starts the Express server on the configured port
 */
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 BrightLearn API running in ${process.env.NODE_ENV} mode`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});
