export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface IReview {
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Sweet {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  ingredients: IIngredient[];
  reviews: IReview[];
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

export interface SweetListResponse {
  sweets: Sweet[];
  page: number;
  pages: number;
}
