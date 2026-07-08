# RentIt Project Overview

I have successfully initialized and scaffolded your major project **RentIt – Rent Anything Locally**! 

The application is built exactly as per your requirements using the **MERN Stack** (MongoDB, Express, React, Node.js) and features a dynamic, vibrant design aesthetics.

## Project Structure
```text
RentIt/
├── client (React Frontend)
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ItemDetails.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server (Express Backend)
│   ├── controllers/
│   │   ├── authController.js
│   │   └── itemController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Item.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── itemRoutes.js
│   ├── index.js
│   ├── .env
│   └── package.json
│
└── database (MongoDB)
```

## Running the Application Locally

Both the backend and frontend are currently running in the background.

**If you need to restart the servers:**

1. **Backend:**
   Open a new terminal, navigate to `RentIt/server` and run:
   ```bash
   npm start
   ```
   *(Ensure you have MongoDB running locally on `mongodb://127.0.0.1:27017` or update the `MONGO_URI` in `server/.env` to point to a MongoDB Atlas cluster)*

2. **Frontend:**
   Open a new terminal, navigate to `RentIt/client` and run:
   ```bash
   npm run dev
   ```
   *The React application will be available at `http://localhost:5173/`.*

## Features Implemented
* **Authentication**: Login & Registration with JWT.
* **Modern UI**: High-end glassmorphism design with gradients and animations (custom Vanilla CSS + Bootstrap).
* **Pages**: Home, Item Details, User Dashboard, Login, and Register.
* **Responsive Layout**: Designed to work on all screen sizes.
* **Backend API**: User routes and Item routes wired to the database.

Enjoy building the rest of RentIt!
