import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Item from './models/Item.js';

dotenv.config();

const runTest = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rentit');
  
  const user = await User.findOne();
  const item = await Item.findOne();
  
  if (!user || !item) {
    console.log("No user or item");
    process.exit(1);
  }

  try {
    // 1. login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        password: '123456789'
      })
    });
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    // 2. book
    const bookRes = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        itemId: item._id,
        startDate: '2026-07-10',
        endDate: '2026-07-15',
        totalAmount: 1000,
        deposit: 500
      })
    });
    
    const bookData = await bookRes.json();
    console.log("STATUS:", bookRes.status);
    console.log("RESPONSE:", bookData);
  } catch (err) {
    console.log("ERROR STATUS:", err.response?.status);
    console.log("ERROR DATA:", err.response?.data);
    console.log("ERROR MESSAGE:", err.message);
  }
  process.exit(0);
};

runTest();
