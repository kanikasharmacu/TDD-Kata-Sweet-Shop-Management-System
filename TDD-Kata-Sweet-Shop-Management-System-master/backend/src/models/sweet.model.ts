import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface ISweet extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: IIngredient[];
  quantity: number;
  minQuantity: number;
  isAvailable: boolean;
  imageUrl?: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ingredientSchema = new Schema<IIngredient>({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: {
      values: ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'pcs'],
      message: 'Please provide a valid unit (g, kg, ml, l, tsp, tbsp, cup, pcs)',
    },
  },
});

const sweetSchema = new Schema<ISweet>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the sweet'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: {
        values: ['chocolate', 'candy', 'cake', 'cookie', 'ice-cream', 'other'],
        message: 'Please provide a valid category',
      },
    },
    ingredients: {
      type: [ingredientSchema],
      required: [true, 'Please provide at least one ingredient'],
      validate: {
        validator: function (v: IIngredient[]) {
          return v.length > 0;
        },
        message: 'Please provide at least one ingredient',
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity in stock'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    minQuantity: {
      type: Number,
      required: [true, 'Please provide minimum quantity threshold'],
      min: [0, 'Minimum quantity cannot be negative'],
      default: 5,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      default: 'default-sweet.jpg',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add a virtual field to check if stock is low
sweetSchema.virtual('isLowStock').get(function (this: ISweet) {
  return this.quantity <= this.minQuantity;
});

// Update isAvailable based on quantity
sweetSchema.pre<ISweet>('save', function (next) {
  this.isAvailable = this.quantity > 0;
  next();
});

// Create and export the model
const Sweet = mongoose.model<ISweet>('Sweet', sweetSchema);

export default Sweet;
