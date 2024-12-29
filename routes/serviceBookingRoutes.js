const express = require('express');
const router = express.Router();
const serviceBookingController = require('../controllers/serviceBookingController');

// Route to update booking statuses
router.put('/update-status', serviceBookingController.updateBookingStatus);

// Route to create a new service booking
router.post('/', serviceBookingController.createServiceBooking);

// Route to get all service bookings
router.get('/', serviceBookingController.getAllServiceBookings);

// Route to get a single service booking by ID
router.get('/:id', serviceBookingController.getServiceBookingById);

// Route to update a service booking by ID
router.put('/:id', serviceBookingController.updateServiceBookingById);

// Route to delete a service booking by ID
router.delete('/:id', serviceBookingController.deleteServiceBookingById);

module.exports = router;