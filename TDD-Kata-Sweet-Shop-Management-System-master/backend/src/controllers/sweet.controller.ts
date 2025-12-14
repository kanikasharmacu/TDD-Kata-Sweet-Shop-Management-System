import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Sweet, { IIngredient, ISweet } from '../models/sweet.model';

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Public
export const getSweets = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        } as const,
      }
    : {};

  const count = await Sweet.countDocuments({ ...keyword });
  const sweets = await Sweet.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    sweets,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Get single sweet
// @route   GET /api/sweets/:id
// @access  Public
export const getSweetById = asyncHandler(async (req: Request, res: Response) => {
  const sweet = await Sweet.findById(req.params.id);

  if (sweet) {
    res.json(sweet);
  } else {
    res.status(404);
    throw new Error('Sweet not found');
  }
});

// @desc    Create a sweet
// @route   POST /api/sweets
// @access  Private/Admin
export const createSweet = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    image,
    category,
    ingredients,
    stock,
  } = req.body;

  const sweet = new Sweet({
    name,
    description,
    price,
    image: image || '/images/default.jpg',
    category,
    ingredients: ingredients || [],
    stock: stock || 0,
    user: req.user._id,
  });

  const createdSweet = await sweet.save();
  res.status(201).json(createdSweet);
});

// @desc    Update a sweet
// @route   PUT /api/sweets/:id
// @access  Private/Admin
export const updateSweet = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    image,
    category,
    ingredients,
    stock,
  } = req.body;

  const sweet = await Sweet.findById(req.params.id);

  if (sweet) {
    sweet.name = name || sweet.name;
    sweet.description = description || sweet.description;
    sweet.price = price || sweet.price;
    sweet.image = image || sweet.image;
    sweet.category = category || sweet.category;
    sweet.ingredients = ingredients || sweet.ingredients;
    sweet.stock = stock !== undefined ? stock : sweet.stock;

    const updatedSweet = await sweet.save();
    res.json(updatedSweet);
  } else {
    res.status(404);
    throw new Error('Sweet not found');
  }
});

// @desc    Delete a sweet
// @route   DELETE /api/sweets/:id
// @access  Private/Admin
export const deleteSweet = asyncHandler(async (req: Request, res: Response) => {
  const sweet = await Sweet.findById(req.params.id);

  if (sweet) {
    await sweet.remove();
    res.json({ message: 'Sweet removed' });
  } else {
    res.status(404);
    throw new Error('Sweet not found');
  }
});

// @desc    Create new review
// @route   POST /api/sweets/:id/reviews
// @access  Private
export const createSweetReview = asyncHandler(async (req: Request, res: Response) => {
  const { rating, comment } = req.body;

  const sweet = await Sweet.findById(req.params.id);

  if (sweet) {
    const alreadyReviewed = sweet.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Sweet already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    sweet.reviews.push(review);
    sweet.numReviews = sweet.reviews.length;
    sweet.rating =
      sweet.reviews.reduce((acc, item) => item.rating + acc, 0) /
      sweet.reviews.length;

    await sweet.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Sweet not found');
  }
});

// @desc    Get top rated sweets
// @route   GET /api/sweets/top
// @access  Public
export const getTopSweets = asyncHandler(async (req: Request, res: Response) => {
  const sweets = await Sweet.find({}).sort({ rating: -1 }).limit(3);
  res.json(sweets);
});

// @desc    Update sweet stock
// @route   PATCH /api/sweets/:id/stock
// @access  Private/Admin
export const updateSweetStock = asyncHandler(async (req: Request, res: Response) => {
  const { quantity } = req.body;

  const sweet = await Sweet.findById(req.params.id);

  if (sweet) {
    if (quantity < 0 && Math.abs(quantity) > sweet.stock) {
      res.status(400);
      throw new Error('Not enough stock');
    }

    sweet.stock += quantity;
    await sweet.save();
    res.json({ message: 'Stock updated', stock: sweet.stock });
  } else {
    res.status(404);
    throw new Error('Sweet not found');
  }
});
