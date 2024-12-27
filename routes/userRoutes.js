const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to create a new user, admin, or employee
router.post('/register', userController.createUser);

// Route for login
router.post('/login', userController.loginUser);

// Routes for users
router.get('/users', userController.getAll('user'));
router.get('/users/:id', userController.getById('user'));
router.put('/users/:id', userController.updateById('user'));
router.delete('/users/:id', userController.deleteById('user'));

// Routes for admins
router.get('/admins', userController.getAll('admin'));
router.get('/admins/:id', userController.getById('admin'));
router.put('/admins/:id', userController.updateById('admin'));
router.delete('/admins/:id', userController.deleteById('admin'));

// Routes for employees
router.get('/employees', userController.getAll('employee'));
router.get('/employees/:id', userController.getById('employee'));
router.put('/employees/:id', userController.updateById('employee'));
router.delete('/employees/:id', userController.deleteById('employee'));

// Route to block a user, admin, or employee
router.post('/block', userController.blockUser);

// Routes for getting and updating profile by email
router.get('/profile/:email', userController.getProfileByEmail);
router.put('/profile/:email', userController.updateProfileByEmail);

module.exports = router;