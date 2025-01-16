const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');


/**
 * Creates a new course.
 *
 * @async
 * @function createCourse
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing course data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the course is created.
 * @throws {Error} - If there is an error creating the course.
 */

async function createCourse(req, res) {
  try {
    const courseData = req.body;
    const newCourse = await mongoService.createCourse(courseData);
    await redisService.cacheCourse(newCourse._id, newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course', details: error.message });
  }
}

/**
 * Retrieves a course by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters of the request.
 * @param {string} req.params.id - The ID of the course to retrieve.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the course is retrieved.
 *
 * @throws {Error} - If there is an error while retrieving the course.
 */
async function getCourse(req, res) {
  try {
    const courseId = req.params.id;
    console.log(`Received course ID: ${courseId}`);
    if (!ObjectId.isValid(courseId)) {
      console.error(`Invalid course ID: ${courseId}`);
      return res.status(400).json({ error: 'Invalid course ID' });
    }
    const cachedCourse = await redisService.getCachedCourse(courseId);
    if (cachedCourse) {
      return res.status(200).json(cachedCourse);
    }
    const course = await mongoService.getCourse(new ObjectId(courseId));
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    await redisService.cacheCourse(courseId, course);
    res.status(200).json(course);
  } catch (error) {
    console.error('Error getting course:', error);
    res.status(500).json({ error: 'Failed to get course', details: error.message });
  }
}

   /**
  +  * Retrieves course statistics.
  +  *
  +  * @param {Object} res - The response object.
  +  * @returns {Promise<void>} - A promise that resolves when the course statistics are retrieved.
  +  *
  +  * @throws {Error} - If there is an error while retrieving the course statistics.
  +  */
    
async function getCourseStats(req, res) {
  try {
    const stats = await mongoService.getCourseStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting course stats:', error);
    res.status(500).json({ error: 'Failed to get course stats', details: error.message });
  }
}

module.exports = {
  createCourse,
  getCourse,
  getCourseStats
};