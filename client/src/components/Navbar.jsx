import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const isLoggedIn = localStorage.getItem('userInfo') ? true : false;
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };

  const closeMenu = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-glass py-3" ref={navbarRef}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeMenu}>
          <Package className="text-primary me-2" size={32} />
          <span className="fw-bold fs-4 text-gradient">RentIt</span>
        </Link>
        
        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link fw-medium mx-2" to="/" onClick={closeMenu}>Home</Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link fw-medium mx-2" to="/dashboard" onClick={closeMenu}>Dashboard</Link>
              </li>
            )}
            <li className="nav-item">
              <a className="nav-link fw-medium mx-2" href="/#categories" onClick={closeMenu}>Categories</a>
            </li>
          </ul>
          
          <div className="d-flex align-items-center flex-wrap gap-3 mt-3 mt-lg-0">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="btn btn-outline-primary rounded-pill px-3 py-2 d-flex align-items-center gap-2" onClick={closeMenu}>
                  <User size={18} />
                  <span className="fw-medium">Edit Profile</span>
                </Link>
                <button onClick={() => { closeMenu(); handleLogout(); }} className="btn btn-primary d-flex align-items-center gap-2">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary" onClick={closeMenu}>Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
