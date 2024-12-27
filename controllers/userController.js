const User = require('../models/User');
const Admin = require('../models/Admin');
const BlockedUser = require('../models/BlockedUser');

// Create a new user, admin, or employee
exports.createUser = async (req, res) => {
  const { username, email, password, phone_number, profile_picture, address, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    let newUser;
    if (role === 'admin') {
      newUser = new Admin({ username, email, password, phone_number, profile_picture, address, role });
    } else if (role === 'user') {
      newUser = new User({ username, email, password, phone_number, profile_picture, address, role });
    } else {
      newUser = new Employee({ username, email, password, phone_number, profile_picture, address, role });
    }
    await newUser.save();

    res.status(201).json(newUser.toJSON());
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
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      return res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
    }

    const admin = await Admin.findOne({ email });
    if (admin && admin.password === password) {
      const adminWithoutPassword = admin.toObject();
      delete adminWithoutPassword.password;
      return res.status(200).json({ message: 'Login successful', admin: adminWithoutPassword });
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


// Block a user, admin, or employee and move to blocked_users collection
exports.blockUser = async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  try {
    // Find the user in the users, admins, or employees collection
    const user = await User.findOne({ email });
    const admin = await Admin.findOne({ email });
    const employee = await Employee.findOne({ email });

    if (!user && !admin && !employee) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Move the user/admin/employee to blocked_users collection
    const blockedUser = new BlockedUser({
      username: user ? user.username : admin ? admin.username : employee.username,
      email: user ? user.email : admin ? admin.email : employee.email,
      password: user ? user.password : admin ? admin.password : employee.password,
      phone_number: user ? user.phone_number : admin ? admin.phone_number : employee.phone_number,
      profile_picture: user ? user.profile_picture : admin ? admin.profile_picture : employee.profile_picture,
      address: user ? user.address : admin ? admin.address : employee.address,
      role: user ? user.role : admin ? admin.role : employee.role,
    });
    await blockedUser.save();

    // Remove the user/admin/employee from the users, admins, or employees collection
    if (user) {
      await User.deleteOne({ email: user.email });
    } else if (admin) {
      await Admin.deleteOne({ email: admin.email });
    } else {
      await Employee.deleteOne({ email: employee.email });
    }

    res.status(200).json({ message: 'User has been blocked and moved to blocked_users collection' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};