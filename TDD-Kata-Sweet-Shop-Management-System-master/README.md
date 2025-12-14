# Sweet Shop Management System

A full-stack application for managing a sweet shop's inventory, sales, and user authentication.

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express and TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest, Supertest
- **Styling**: Material-UI with custom theme

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `backend` and `frontend` directories
   - Update the values according to your setup

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # In a new terminal, start frontend server
   cd frontend
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
sweet-shop/
├── backend/               # Backend server
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utility functions
│   │   └── index.ts      # Application entry point
│   ├── .env              # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/             # Frontend React application
    ├── public/           # Static files
    ├── src/
    │   ├── assets/       # Images, fonts, etc.
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   ├── store/        # State management
    │   ├── styles/       # Global styles
    │   ├── types/        # TypeScript type definitions
    │   ├── utils/        # Utility functions
    │   ├── App.tsx
    │   └── index.tsx
    ├── .env              # Frontend environment variables
    ├── package.json
    └── tsconfig.json
```

## Features

- User authentication (register, login, logout)
- Role-based access control (Admin, Staff, Customer)
- Sweet product management (CRUD operations)
- Inventory management
- Search and filter sweets
- Responsive design

## Testing

Run tests for the backend:
```bash
cd backend
npm test
```

Run tests for the frontend:
```bash
cd frontend
npm test
```

## Deployment

### Backend

1. Build the TypeScript code:
   ```bash
   cd backend
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Frontend

1. Build the React application:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `build` folder to your preferred static hosting service (e.g., Vercel, Netlify, or AWS S3).

## My AI Usage

I used AI assistance (GitHub Copilot) to help with:
- Generating boilerplate code for the Express server setup
- Creating the error handling middleware
- Setting up the project structure and configuration files
- Writing documentation and README

The AI helped accelerate the initial setup and provided suggestions for best practices in TypeScript and Node.js development.
