const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String },
  profile_picture: { type: String },
  address: { type: String },
  role: { type: String, required: true, default: 'user' }
}, { timestamps: true });

// Exclude password and reorganize the response
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.created_at;
  delete obj.updated_at;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;