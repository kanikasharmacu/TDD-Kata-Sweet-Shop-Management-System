import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

interface ErrorResponse {
  success: boolean;
  error: string;
  message?: string;
  stack?: string;
  errors?: Record<string, string>;
}

// Custom error class for application-specific errors
class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error response
  let errorResponse: ErrorResponse = {
    success: false,
    error: 'Internal Server Error',
  };

  // Handle development vs production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Log error in development
  if (isDevelopment) {
    console.error('Error:', err);
  }

  // Handle Mongoose validation errors
  if (err instanceof MongooseError.ValidationError) {
    const errors: Record<string, string> = {};
    Object.values(err.errors).forEach((e: any) => {
      errors[e.path] = e.message;
    });
    
    errorResponse = {
      success: false,
      error: 'Validation Error',
      message: 'One or more validation errors occurred',
      errors,
    };
    
    if (isDevelopment) {
      errorResponse.stack = err.stack;
    }
    
    return res.status(400).json(errorResponse);
  }

  // Handle duplicate key errors (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    errorResponse = {
      success: false,
      error: 'Duplicate Field Error',
      message: `The ${field} '${err.keyValue[field]}' is already in use`,
    };
    
    if (isDevelopment) {
      errorResponse.stack = err.stack;
    }
    
    return res.status(400).json(errorResponse);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    errorResponse = {
      success: false,
      error: 'Invalid Token',
      message: 'The provided token is invalid',
    };
    
    if (isDevelopment) {
      errorResponse.stack = err.stack;
    }
    
    return res.status(401).json(errorResponse);
  }

  // Handle JWT expired error
  if (err.name === 'TokenExpiredError') {
    errorResponse = {
      success: false,
      error: 'Token Expired',
      message: 'The provided token has expired',
    };
    
    if (isDevelopment) {
      errorResponse.stack = err.stack;
    }
    
    return res.status(401).json(errorResponse);
  }

  // Handle our custom AppError
  if (err instanceof AppError) {
    errorResponse = {
      success: false,
      error: err.status,
      message: err.message,
    };
    
    if (isDevelopment) {
      errorResponse.stack = err.stack;
    }
    
    return res.status(err.statusCode).json(errorResponse);
  }

  // Handle other types of errors
  if (isDevelopment) {
    errorResponse = {
      success: false,
      error: err.message || 'Internal Server Error',
      message: err.stack,
      stack: err.stack,
    };
  }

  // Default 500 error
  res.status(500).json(errorResponse);
};

// 404 Not Found handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

export default AppError;
