import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Item from './models/Item.js';
import Booking from './models/Booking.js';

dotenv.config();

const users = [
  { name: 'Owner User', email: 'owner@example.in', phone: '9876543210', role: 'owner' },
  { name: 'Renter User', email: 'renter@example.in', phone: '9988776655', role: 'customer' }
];

const locations = ['Indiranagar, Bengaluru', 'Andheri West, Mumbai', 'Koramangala, Bengaluru', 'Gachibowli, Hyderabad', 'Connaught Place, Delhi', 'Viman Nagar, Pune'];

const generateItems = (userIds) => {
  const items = [];
  const baseItems = [
    { title: 'Sony A7III Camera', desc: 'Great for wedding and portrait photography. Captures stunning 4K video.', cat: 'Cameras', price: 1500, dep: 1500, img: '/camera_1783414290379.png' },
    { title: 'DJI Mavic Air 2 Drone', desc: '4K drone with extra batteries. Perfect for cinematic aerial shots.', cat: 'Drones', price: 2500, dep: 2500, img: '/drone_1783414301940.png' },
    { title: 'PlayStation 5 Console', desc: 'Comes with 2 DualSense controllers and FIFA 24. Great for weekend gaming.', cat: 'Gaming', price: 800, dep: 1000, img: '/ps5_realistic_1783414347951.png' },
    { title: 'Bosch Power Drill Set', desc: 'Heavy duty drill with all bits included. Perfect for home DIY and repairs.', cat: 'Power Tools', price: 300, dep: 200, img: '/drill_realistic_1783414360768.png' },
    { title: 'JBL Partybox 310', desc: 'Loud bluetooth speaker with dynamic light shows. Perfect for house parties or sangeets.', cat: 'Party Items', price: 1000, dep: 800, img: '/jbl_realistic_1783414395170.png' },
    { title: 'Decathlon Rockrider MTB', desc: '21 gear mountain bike in great condition. Helmet included for safety.', cat: 'Sports', price: 500, dep: 500, img: '/mtb_realistic_1783414414018.png' },
    { title: 'MacBook Pro M2 16"', desc: 'Fast laptop for video editing and development. 32GB RAM. Ideal for freelance projects.', cat: 'Electronics', price: 2000, dep: 5000, img: '/macbook_realistic_1783414455827.png' },
    { title: 'Quechua Camping Tent (4-Person)', desc: 'Waterproof tent, easy setup. Perfect for weekend treks in the Western Ghats or Himalayas.', cat: 'Sports', price: 400, dep: 200, img: '/tent_realistic_1783414468202.png' }
  ];

  const ownerId = userIds[0];

  return baseItems.map((base, i) => ({
    ownerId: ownerId,
    title: base.title,
    description: base.desc + ' Available for short and long term rentals.',
    category: base.cat,
    pricePerDay: base.price,
    deposit: base.dep,
    images: [base.img],
    location: locations[i % locations.length],
    contactNumber: users[0].phone,
    availability: true,
    status: 'active'
  }));
};

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rentit');
    
    await Booking.deleteMany();
    await Item.deleteMany();
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456789', salt);

    const createdUsers = [];
    for (const u of users) {
      const user = await User.create({ ...u, password: hashedPassword });
      createdUsers.push(user._id);
    }

    const items = generateItems(createdUsers);
    const createdItems = await Item.insertMany(items);

    const dummyBookings = [
      {
        itemId: createdItems[0]._id,
        userId: createdUsers[1],
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        totalAmount: 3000,
        deposit: 1500,
        status: 'completed',
        paymentStatus: 'paid',
        renterReview: {
          rating: 5,
          comment: "Absolutely amazing! The camera was in perfect condition and the owner was very helpful.",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        ownerReview: {
          rating: 5,
          comment: "Great renter, returned the camera on time and took good care of it.",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      {
        itemId: createdItems[1]._id,
        userId: createdUsers[1],
        startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        totalAmount: 5000,
        deposit: 2500,
        status: 'completed',
        paymentStatus: 'paid',
        renterReview: {
          rating: 4,
          comment: "Drone flew perfectly. Battery life was slightly lower than expected, but overall a great experience.",
          createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000)
        },
        ownerReview: {
          rating: 4,
          comment: "Renter was slightly late for drop-off but communicated well.",
          createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000)
        }
      }
    ];

    await Booking.insertMany(dummyBookings);

    console.log('Database seeded successfully! Created test users, items, and dummy reviews.');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
