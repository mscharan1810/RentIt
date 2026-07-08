import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  deposit: { type: Number, required: true },
  renterReview: {
    rating: { type: Number },
    comment: { type: String }
  },
  ownerReview: {
    rating: { type: Number },
    comment: { type: String }
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
