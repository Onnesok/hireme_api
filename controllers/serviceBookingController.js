const ServiceBooking = require('../models/ServiceBooking');
const User = require('../models/User');
const Employee = require('../models/Employee');

// Create a new service booking
exports.createServiceBooking = async (req, res) => {
  const { customer_email, employee_email, service, scheduled_date, description } = req.body;
  if (!customer_email || !employee_email || !service.name || !service.price || !scheduled_date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const customer = await User.findOne({ email: customer_email });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const employee = await Employee.findOne({ email: employee_email });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if the employee is already booked on the same day
    const startOfDay = new Date(scheduled_date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(scheduled_date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingBooking = await ServiceBooking.findOne({
      employee_email,
      scheduled_date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Employee is already booked on this day' });
    }

    const newServiceBooking = new ServiceBooking({
      customer_email,
      employee_email,
      service,
      address: customer.address,
      scheduled_date,
      status: 'pending',
      description,
      customer_details: {
        name: customer.username,
        phone: customer.phone_number
      },
      employee_details: {
        name: employee.username,
        phone: employee.phone_number
      }
    });

    await newServiceBooking.save();
    res.status(201).json(newServiceBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all service bookings with optional filters
exports.getAllServiceBookings = async (req, res) => {
  const { customer_email, employee_email, status } = req.query;
  const query = {};

  if (customer_email) {
    query.customer_email = customer_email;
  }
  if (employee_email) {
    query.employee_email = employee_email;
  }
  if (status) {
    query.status = status;
  }

  try {
    const serviceBookings = await ServiceBooking.find(query);
    res.status(200).json(serviceBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single service booking by ID
exports.getServiceBookingById = async (req, res) => {
  try {
    const serviceBooking = await ServiceBooking.findById(req.params.id);
    if (!serviceBooking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }
    res.status(200).json(serviceBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a service booking by ID
exports.updateServiceBookingById = async (req, res) => {
  try {
    const serviceBooking = await ServiceBooking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!serviceBooking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }
    res.status(200).json(serviceBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a service booking by ID
exports.deleteServiceBookingById = async (req, res) => {
  try {
    const serviceBooking = await ServiceBooking.findByIdAndDelete(req.params.id);
    if (!serviceBooking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }
    res.status(200).json({ message: 'Service booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update status of bookings after the scheduled date has passed
exports.updateBookingStatus = async (req, res) => {
  try {
    const currentDate = new Date();
    const updatedBookings = await ServiceBooking.updateMany(
      { scheduled_date: { $lt: currentDate }, status: { $nin: ['completed', 'cancelled'] } },
      { $set: { status: 'completed' } }
    );

    res.status(200).json({ message: 'Booking statuses updated', updatedCount: updatedBookings.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the status of a specific service booking
exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const serviceBooking = await ServiceBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!serviceBooking) {
      return res.status(404).json({ message: 'Service booking not found' });
    }

    res.status(200).json(serviceBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};