const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const serviceBookingRoutes = require('./routes/serviceBookingRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api/service-bookings', serviceBookingRoutes);
app.use('/api/employees', employeeRoutes); // Add this line

// Middleware to handle errors securely
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});