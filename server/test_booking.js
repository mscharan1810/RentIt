import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/Booking.js';
import User from './models/User.js';
import Item from './models/Item.js';

dotenv.config();

const testBooking = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rentit');
  
  const user = await User.findOne();
  const item = await Item.findOne();

  try {
    const booking = await Booking.create({
      userId: user._id,
      itemId: item._id,
      startDate: '2026-07-08',
      endDate: '2026-07-10',
      totalAmount: 500,
      deposit: 100
    });
    console.log("Success:", booking);
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit();
}

testBooking();
