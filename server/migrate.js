import mongoose from 'mongoose';
import User from './models/User.js';
import Item from './models/Item.js';
import Booking from './models/Booking.js';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/rentit';
const CLOUD_URI = 'mongodb+srv://d38139014_db_user:d38139014@cluster0.7dbuyrw.mongodb.net/rentit?retryWrites=true&w=majority';

const migrate = async () => {
  try {
    // 1. Connect to local DB
    console.log('Connecting to local DB...');
    const localDb = await mongoose.createConnection(LOCAL_URI).asPromise();
    
    // Fetch all local data using raw collections to avoid schema issues
    const users = await localDb.collection('users').find({}).toArray();
    const items = await localDb.collection('items').find({}).toArray();
    const bookings = await localDb.collection('bookings').find({}).toArray();
    
    console.log(`Found ${users.length} users, ${items.length} items, ${bookings.length} bookings locally.`);
    await localDb.close();

    // 2. Connect to Cloud DB
    console.log('Connecting to Cloud DB...');
    const cloudDb = await mongoose.createConnection(CLOUD_URI).asPromise();
    
    // 3. Clear cloud DB and Insert
    console.log('Clearing cloud collections...');
    await cloudDb.collection('users').deleteMany({});
    await cloudDb.collection('items').deleteMany({});
    await cloudDb.collection('bookings').deleteMany({});

    console.log('Inserting data to cloud...');
    if (users.length > 0) await cloudDb.collection('users').insertMany(users);
    if (items.length > 0) await cloudDb.collection('items').insertMany(items);
    if (bookings.length > 0) await cloudDb.collection('bookings').insertMany(bookings);

    console.log('Migration complete successfully!');
    await cloudDb.close();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
