import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'owner', 'admin'], default: 'customer' },
  address: { type: String },
  profileImage: { type: String }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
