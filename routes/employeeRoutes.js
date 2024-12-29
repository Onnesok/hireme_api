const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Route to get employees who are free on a particular date
router.get('/free', employeeController.getFreeEmployees);

module.exports = router;