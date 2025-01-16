const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/stats', courseController.getCourseStats);
router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourse);

module.exports = router;