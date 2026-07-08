import Item from '../models/Item.js';
import asyncHandler from 'express-async-handler';

export const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ status: 'active' }).populate('ownerId', 'name');
  res.json(items);
});

export const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate('ownerId', 'name email phone');
  if (item) {
    const Booking = (await import('../models/Booking.js')).default;
    const reviews = await Booking.find({ itemId: item._id, 'renterReview.rating': { $exists: true } })
      .populate('userId', 'name')
      .select('renterReview userId createdAt');
      
    res.json({ item, reviews });
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

export const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, pricePerDay, deposit, images, location, googleMapLink } = req.body;

  const item = new Item({
    ownerId: req.user._id,
    title,
    description,
    category,
    pricePerDay,
    deposit,
    images: images || [],
    location,
    googleMapLink
  });

  const createdItem = await item.save();
  res.status(201).json(createdItem);
});

export const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    if (item.ownerId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to edit this item');
    }

    item.title = req.body.title || item.title;
    item.description = req.body.description || item.description;
    item.category = req.body.category || item.category;
    item.pricePerDay = req.body.pricePerDay || item.pricePerDay;
    item.deposit = req.body.deposit || item.deposit;
    item.images = req.body.images || item.images;
    item.location = req.body.location || item.location;
    if (req.body.googleMapLink !== undefined) {
      item.googleMapLink = req.body.googleMapLink;
    }
    if (req.body.contactNumber !== undefined) {
      item.contactNumber = req.body.contactNumber;
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    if (item.ownerId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this item');
    }

    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});
