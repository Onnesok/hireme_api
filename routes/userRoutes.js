const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get all users
router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Add a new user
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body); // Use request body for data
    await newUser.save(); // Save the user to the database
    res.status(201).json(newUser); // Respond with the newly created user
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

module.exports = router;
