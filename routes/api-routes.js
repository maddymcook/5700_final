// routes/api-routes.js
const express = require('express');
const router = express.Router();

const apiController = require('../controllers/api-controller'); 

// GET /api/token
router.get('/token', apiController.getToken);

// GET /api/courses?token=...
router.get('/courses', apiController.verifyToken, apiController.getCourses);

module.exports = router;
