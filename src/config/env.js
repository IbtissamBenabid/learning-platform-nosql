const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGO_URI',
  'MONGO_DB_NAME',
  'REDIS_URI',
  'PORT'
];

/**
 * Validates the presence of required environment variables.
 * 
 * This function checks if all required environment variables are set in the process environment.
 * If any required environment variables are missing, it throws an error listing the missing variables.
 * 
 * @throws {Error} If any required environment variables are missing.
 */
function validateEnv() {
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Les variables d'environnement suivantes sont manquantes : ${missingVars.join(', ')}`);
  }
}

validateEnv();

module.exports = {
  mongoUri: process.env.MONGO_URI,
  mongoDbName: process.env.MONGO_DB_NAME,
  redisUri: process.env.REDIS_URI,
  port: process.env.PORT
};