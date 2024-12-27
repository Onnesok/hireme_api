const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String },
  profile_picture: { type: String },
  address: { type: String },
  role: { type: String, required: true }
}, { timestamps: true });

// Exclude password from the response
employeeSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;