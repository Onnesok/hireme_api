const User = require('../models/User');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const BlockedUser = require('../models/BlockedUser');

// Create a new user, admin, or employee with explicit role
exports.createUser = async (req, res) => {
  const { username, email, password, phone_number, profile_picture, address, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields including role are required' });
  }

  try {
    const blockedUser = await BlockedUser.findOne({ email });
    if (blockedUser) {
      return res.status(403).json({ message: 'User is blocked and cannot be created.' });
    }
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

// Factory function to get all users, admins, or employees
exports.getAll = (role) => async (req, res) => {
  try {
    let results;
    if (role === 'admin') {
      results = await Admin.find();
    } else if (role === 'user') {
      results = await User.find();
    } else if (role === 'employee') {
      results = await Employee.find();
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Factory function to get a single user, admin, or employee by ID
exports.getById = (role) => async (req, res) => {
  try {
    let result;
    if (role === 'admin') {
      result = await Admin.findById(req.params.id);
    } else if (role === 'user') {
      result = await User.findById(req.params.id);
    } else if (role === 'employee') {
      result = await Employee.findById(req.params.id);
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (!result) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Factory function to update a user, admin, or employee by ID
exports.updateById = (role) => async (req, res) => {
  try {
    let result;
    if (role === 'admin') {
      result = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    } else if (role === 'user') {
      result = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    } else if (role === 'employee') {
      result = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (!result) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Factory function to delete a user, admin, or employee by ID
exports.deleteById = (role) => async (req, res) => {
  try {
    let result;
    if (role === 'admin') {
      result = await Admin.findByIdAndDelete(req.params.id);
    } else if (role === 'user') {
      result = await User.findByIdAndDelete(req.params.id);
    } else if (role === 'employee') {
      result = await Employee.findByIdAndDelete(req.params.id);
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (!result) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ message: 'Deleted successfully' });
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
      blocked_at: new Date()
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

// Get profile by email
exports.getProfileByEmail = async (req, res) => {
  const { email } = req.params;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  try {
    const user = await User.findOne({ email });
    const admin = await Admin.findOne({ email });
    const employee = await Employee.findOne({ email });

    if (user) {
      return res.status(200).json(user);
    } else if (admin) {
      return res.status(200).json(admin);
    } else if (employee) {
      return res.status(200).json(employee);
    } else {
      return res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update profile by email
exports.updateProfileByEmail = async (req, res) => {
  const { email } = req.params;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  try {
    const user = await User.findOneAndUpdate({ email }, req.body, { new: true, runValidators: true });
    const admin = await Admin.findOneAndUpdate({ email }, req.body, { new: true, runValidators: true });
    const employee = await Employee.findOneAndUpdate({ email }, req.body, { new: true, runValidators: true });

    if (user) {
      return res.status(200).json(user);
    } else if (admin) {
      return res.status(200).json(admin);
    } else if (employee) {
      return res.status(200).json(employee);
    } else {
      return res.status(404).json({ message: 'Profile not found' });
    }
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

    const employee = await Employee.findOne({ email });
    if (employee && employee.password === password) {
      const employeeWithoutPassword = employee.toObject();
      delete employeeWithoutPassword.password;
      return res.status(200).json({ message: 'Login successful', employee: employeeWithoutPassword });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};