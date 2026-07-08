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

Follow these steps to set up the project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mscharan1810/RentIt.git
   cd RentIt
   ```

2. **Install dependencies and setup Backend:**
   Open a terminal, navigate to `RentIt/server` and run:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(Update the `MONGO_URI` and `JWT_SECRET` in `server/.env` with your actual values)*
   
   Start the backend server:
   ```bash
   npm start
   ```

3. **Install dependencies and setup Frontend:**
   Open a new terminal, navigate to `RentIt/client` and run:
   ```bash
   cd client
   npm install
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
