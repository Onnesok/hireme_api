const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Route to get employees who are free on a particular date
router.get('/work/free', employeeController.getFreeEmployees);

// Define other employee-related routes here
router.get('/', employeeController.getAllEmployees);  // Example route

module.exports = router;