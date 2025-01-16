const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;


/**
 * Connects to the MongoDB database using the provided configuration.
 * 
 * This function initializes a new MongoClient instance with the MongoDB URI
 * from the configuration, attempts to connect to the MongoDB server, and
 * sets the database instance to the specified database name in the configuration.
 * 
 * @async
 * @function connectMongo
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 * @throws {Error} Throws an error if the connection to MongoDB fails.
 */
async function connectMongo() {
  try {
    mongoClient = new MongoClient(config.mongoUri);
    await mongoClient.connect();
    db = mongoClient.db(config.mongoDbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

/**
 * Asynchronously connects to a Redis server using the provided configuration.
 * Logs a message upon successful connection or an error message if the connection fails.
 *
 * @async
 * @function connectRedis
 * @throws Will throw an error if the connection to Redis fails.
 */
async function connectRedis() {
  try {
    redisClient = redis.createClient({ url: config.redisUri });
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
  }
}

module.exports = {
  connectMongo,
  connectRedis,
  getMongoClient: () => mongoClient,
  getRedisClient: () => redisClient,
  getDb: () => db
};