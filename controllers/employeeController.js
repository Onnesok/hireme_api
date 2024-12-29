const ServiceBooking = require('../models/ServiceBooking');
const Employee = require('../models/Employee');

// Get employees who are free on a particular date
exports.getFreeEmployees = async (req, res) => {
  const { date, role } = req.query; // Extract role from query parameters
  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    // Convert the date to start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Find all bookings for the given date
    const bookedEmployees = await ServiceBooking.find({
      scheduled_date: { $gte: startOfDay, $lte: endOfDay }
    }).distinct('employee_email');

    // Find employees who are not booked on that date and match the role if provided
    const query = {
      email: { $nin: bookedEmployees }
    };

    if (role) {
      query.role = role;
    }

    const freeEmployees = await Employee.find(query);

    res.status(200).json(freeEmployees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Example function to get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};