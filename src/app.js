
const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');

const app = express();

async function startServer() {
  try {
    await db.connectMongo();
    await db.connectRedis();

    app.use(express.json());

    app.use('/courses', courseRoutes);

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}


process.on('SIGTERM', async () => {
  try {
    await db.disconnectMongo();
    await db.disconnectRedis();
    console.log('Gracefully shutting down');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();