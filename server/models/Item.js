import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  deposit: { type: Number, required: true },
  images: [{ type: String }],
  location: { type: String },
  googleMapLink: { type: String },
  contactNumber: { type: String },
  availability: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'inactive', 'rented'], default: 'active' }
}, {
  timestamps: true
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
