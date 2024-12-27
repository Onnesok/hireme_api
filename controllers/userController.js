const User = require('../models/User');
const Admin = require('../models/Admin');
const BlockedUser = require('../models/BlockedUser');

// Create a new user or admin
exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    if (role === 'admin') {
      const newAdmin = new Admin({ username, email, password, role });
      await newAdmin.save();
      res.status(201).json(newAdmin);
    } else {
      const newUser = new User({ username, email, password, role });
      await newUser.save();
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
exports.updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const blockedUser = await BlockedUser.findOne({ email });
    if (blockedUser) {
      return res.status(403).json({ message: 'User is blocked' });
    }

    const user = await User.findOne({ email });
    if (user && user.password === password) {
      return res.status(200).json({ message: 'Login successful', user });
    }

    const admin = await Admin.findOne({ email });
    if (admin && admin.password === password) {
      return res.status(200).json({ message: 'Login successful', admin });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by email
exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Block a user and move to blocked_users collection
exports.blockUser = async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  try {
    // Find the user in the users or admins collection
    const user = await User.findOne({ email });
    const admin = await Admin.findOne({ email });

    if (!user && !admin) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Move the user/admin to blocked_users collection
    const blockedUser = new BlockedUser({
      username: user ? user.username : admin.username,
      email: user ? user.email : admin.email,
      password: user ? user.password : admin.password,
      role: user ? user.role : 'admin',
    });
    await blockedUser.save();

    // Remove the user/admin from the users or admins collection
    if (user) {
      await User.deleteOne({ email: user.email });
    } else {
      await Admin.deleteOne({ email: admin.email });
    }

    res.status(200).json({ message: 'User has been blocked and moved to blocked_users collection' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};