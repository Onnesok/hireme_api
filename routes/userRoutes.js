const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to create a new user or admin
router.post('/register', userController.createUser);

// Route to get all users
router.get('/', userController.getUsers);

// Route to get a single user by ID
router.get('/:id', userController.getUserById);

// Route to update a user by ID
router.put('/:id', userController.updateUserById);

// Route to delete a user by ID
router.delete('/:id', userController.deleteUserById);

// Route to login a user or admin
router.post('/login', userController.loginUser);

// Route to get user by email
router.get('/email/:email', userController.getUserByEmail);

// Route to block a user and move their data to blocked_users collection
router.post('/block', userController.blockUser);

module.exports = router;