const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema({
  customer_email: { type: String, required: true },
  employee_email: { type: String, required: true },
  service: {
    name: { type: String, required: true },
    price: { type: Number, required: true }
  },
  address: { type: String, required: true },
  scheduled_date: { type: Date, required: true },
  status: { type: String, required: true, default: 'pending' },
  description: { type: String },
  customer_details: {
    name: { type: String, required: true },
    phone: { type: String, required: true }
  },
  employee_details: {
    name: { type: String, required: true },
    phone: { type: String, required: true }
  }
}, { timestamps: true });

const ServiceBooking = mongoose.model('ServiceBooking', serviceBookingSchema);

module.exports = ServiceBooking;