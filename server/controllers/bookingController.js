import Booking from '../models/Booking.js';
import Item from '../models/Item.js';

export const createBooking = async (req, res) => {
  try {
    const { itemId, startDate, endDate, totalAmount, deposit } = req.body;
    
    const booking = await Booking.create({
      userId: req.user._id,
      itemId,
      startDate,
      endDate,
      totalAmount,
      deposit
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking Creation Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('itemId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    // Find all items owned by this user
    const userItems = await Item.find({ ownerId: req.user._id }).select('_id');
    const itemIds = userItems.map(item => item._id);
    
    // Find all bookings for these items
    const bookings = await Booking.find({ itemId: { $in: itemIds } })
      .populate('itemId')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();
      
    // Calculate average renter rating
    for (let booking of bookings) {
      if (booking.userId) {
        const renterReviews = await Booking.find({ userId: booking.userId._id, 'ownerReview.rating': { $exists: true } });
        if (renterReviews.length > 0) {
          const sum = renterReviews.reduce((acc, rev) => acc + rev.ownerReview.rating, 0);
          booking.userId.averageRating = (sum / renterReviews.length).toFixed(1);
          booking.userId.reviewCount = renterReviews.length;
        }
      }
    }
      
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('itemId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Verify ownership
    if (booking.itemId.ownerId.toString() !== req.user._id.toString()) {
      if (status === 'cancelled' && booking.userId.toString() === req.user._id.toString()) {
        // renter is allowed to cancel their own booking
      } else {
        return res.status(401).json({ message: 'Not authorized' });
      }
    }
    
    booking.status = status;
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const processPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('itemId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Only the owner can confirm payment
    if (booking.itemId.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Only the owner can confirm payment' });
    }
    
    booking.paymentStatus = 'paid';
    booking.status = 'completed'; // Once paid, transaction is complete
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment, role } = req.body;
    const booking = await Booking.findById(req.params.id).populate('itemId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Reviews can only be added after successful payment' });
    }
    
    if (role === 'renter') {
      if (booking.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      booking.renterReview = { rating: Number(rating), comment };
    } else if (role === 'owner') {
      if (booking.itemId.ownerId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      booking.ownerReview = { rating: Number(rating), comment };
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
