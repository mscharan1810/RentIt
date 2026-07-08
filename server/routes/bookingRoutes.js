import express from 'express';
import { createBooking, getUserBookings, getOwnerBookings, updateBookingStatus, processPayment, addReview } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/mybookings', protect, getUserBookings);
router.get('/ownerbookings', protect, getOwnerBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/pay', protect, processPayment);
router.post('/:id/review', protect, addReview);

export default router;
