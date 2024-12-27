const mongoose = require('mongoose');

const blockedUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String },
  profile_picture: { type: String },
  address: { type: String },
  role: { type: String, required: true },
  blocked_at: { type: Date, default: Date.now }
}, { timestamps: true });

// Exclude password from the response
blockedUserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const BlockedUser = mongoose.model('BlockedUser', blockedUserSchema);

module.exports = BlockedUser;