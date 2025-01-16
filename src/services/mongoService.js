const db = require('../config/db');


 /**
 * Adds a new course to the 'courses' collection in the MongoDB database.
**/

async function createCourse(courseData) {
  try {
    const result = await db.getDb().collection('courses').insertOne(courseData);
    const newCourse = await db.getDb().collection('courses').findOne({ _id: result.insertedId });
    return newCourse;
  } catch (error) {
    console.error('Error in mongoService.createCourse:', error);
    throw error;
  }
}


/**
 * Retrieves a course from the 'courses' collection in the MongoDB database.
 **/
async function getCourse(courseId) {
  try {
    return await db.getDb().collection('courses').findOne({ _id: courseId });
  } catch (error) {
    console.error('Error in mongoService.getCourse:', error);
    throw error;
  }
}

/**
 * Retrieves the total number of courses in the 'courses' collection in the MongoDB database.
 * */

async function getCourseStats() {
  try {
    const stats = await db.getDb().collection('courses').aggregate([
      { $group: { _id: null, totalCourses: { $sum: 1 } } }
    ]).toArray();
    return stats[0];
  } catch (error) {
    console.error('Error in mongoService.getCourseStats:', error);
    throw error;
  }
}

module.exports = {
  createCourse,
  getCourse,
  getCourseStats
};