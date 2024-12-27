const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
});

const User = mongoose.model('User', userSchema);

<<<<<<< HEAD:models/user.js
module.exports = User;
=======
module.exports = User; 
>>>>>>> 0e4cf1da683efa823f2335d9b6d71c3f4b954ab2:models/User.js
