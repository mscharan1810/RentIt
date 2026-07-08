import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ItemDetails from './pages/ItemDetails.jsx';
import Search from './pages/Search.jsx';
import AddItem from './pages/AddItem.jsx';
import Profile from './pages/Profile.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container-fluid p-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/edit-item/:id" element={<AddItem />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
