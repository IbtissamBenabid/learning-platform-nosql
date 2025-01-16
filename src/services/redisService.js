const db = require('../config/db');

// Cache course data in Redis

async function cacheCourse(courseId, courseData) {
  try {
    await db.getRedisClient().set(`course:${courseId}`, JSON.stringify(courseData));
  } catch (error) {
    console.error('Error in redisService.cacheCourse:', error);
    throw error;
  }
}

// Get course data from Redis cache
async function getCachedCourse(courseId) {
  try {
    const cachedCourse = await db.getRedisClient().get(`course:${courseId}`);
    return cachedCourse ? JSON.parse(cachedCourse) : null;
  } catch (error) {
    console.error('Error in redisService.getCachedCourse:', error);
    throw error;
  }
}

module.exports = {
  cacheCourse,
  getCachedCourse
};