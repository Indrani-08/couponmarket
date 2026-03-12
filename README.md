# CouponMarket

A professional, modern, and high-performance Coupon Marketplace built with the MERN stack (MongoDB, Express, React, Node.js). Discover, buy, sell, and claim premium discount coupons natively in a single comprehensive application.

## Key Features
- **Authentication:** JWT secure authentication, password resets.
- **Smart Theme Engine:** Global robust light and dark modes with persistent toggles.
- **Marketplace Logic:** Sophisticated locking and claiming mechanisms via Cart, Orders, and Wallet mechanics.
- **Advanced Gamification:** An interactive Scratch Card with Daily Rewards system mapped to User Balances.
- **Premium UI:** Polished interface featuring sleek glassmorphism navbars, smooth layouts, React Icons integration, and responsive behavior.
- **Role Control:** Basic admin-accessible routes for managing listed coupons natively.

## Prerequisites
- Node.js (v18+)
- MongoDB connection URI (e.g. MongoDB Atlas or localhost)
- Vite configuration.

## Setup Instructions

### 1. Database and Environment
In the `backend` folder, duplicate `.env.example` as `.env`:
```sh
cp .env.example .env
```
Fill out the variables (`MONGO_URI`, `JWT_SECRET`, etc). 

### 2. Backend Setup
Install dependencies and run the Node REST API:
```sh
cd backend
npm install
npm run dev
```
*(The server will typically start on port 5000)*

### 3. Frontend Setup
Install dependencies and run the Vite React app:
```sh
cd frontend
npm install
npm run dev
```

### 4. Running the Full Stack
Ensure both the frontend and backend are concurrently running in split terminals. The application will be accessible via `http://localhost:5173`. 

## Deployment
- **Frontend:** Optimized for Vercel/Netlify. Ensure build commands map to `npm run build` and output directory `dist`.
- **Backend:** Setup `render.yaml` or deploy explicitly via Railway/Render by binding process environment variables respectively.

## Architecture Guidelines
- **/frontend/src/components:** Reusable React functional components.
- **/frontend/src/context:** Context API configurations like ThemeContext.
- **/frontend/src/pages:** Major application views mapped accurately via `react-router-dom`.
- **/backend/models:** Mongoose schemas (`User`, `Coupon`, `Order`, `Cart`).
- **/backend/controllers**: Application core API logic.
