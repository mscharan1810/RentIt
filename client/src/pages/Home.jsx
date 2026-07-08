import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Star, MapPin, Calendar } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?category=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };
  
  const categories = ['Electronics', 'Cameras', 'Drones', 'Gaming', 'Power Tools', 'Party Items', 'Sports'];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get('https://server-ten-pi-36.vercel.app/api/items');
        setItems(data.slice(0, 8)); // Display only first 8 items on Home
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items', error);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" id="hero">
        <div className="hero-shape shape-1"></div>
        <div className="hero-shape shape-2"></div>
        
        <div className="container hero-content text-center">
          <span className="badge bg-white text-primary px-3 py-2 rounded-pill shadow-sm mb-4 border border-light">
            ✨ Welcome to the Future of Renting
          </span>
          <h1 className="display-3 fw-bold mb-4" style={{lineHeight: 1.2}}>
            Why Buy When You Can <br />
            <span className="text-gradient">Rent Locally?</span>
          </h1>
          <p className="lead mb-5 text-muted mx-auto" style={{maxWidth: '600px'}}>
            Borrow everyday items from people nearby. Save money, reduce waste, and connect with your community.
          </p>

          <div className="search-bar mx-auto" style={{maxWidth: '700px'}}>
            <Search className="text-muted ms-3" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="What do you need to rent today?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>
              <Search size={20} />
            </button>
          </div>
          
          <div className="mt-5 pt-3">
            <p className="text-muted mb-3 fs-6">Popular right now:</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {categories.map(cat => (
                <Link key={cat} to={`/search?category=${encodeURIComponent(cat)}`} style={{textDecoration: 'none'}}>
                  <span className="category-pill">{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rentals */}
      <section className="py-5 my-5 bg-white" id="categories">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-bold mb-2">Trending Rentals</h2>
              <p className="text-muted mb-0">Discover what people are renting near you</p>
            </div>
            <Link to="/search" className="btn btn-outline-primary d-none d-md-block">View All</Link>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {items.map(item => (
                <div key={item._id} className="col-12 col-md-6 col-lg-3">
                  <Link to={`/item/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card item-card glass-card h-100 cursor-pointer">
                      <div className="item-img-wrapper">
                        <img src={item.images[0]} alt={item.title} className="item-img" />
                        <div className="price-badge">₹{item.pricePerDay}/day</div>
                      </div>
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted small d-flex align-items-center gap-1">
                            <MapPin size={14} /> {item.location || 'Local'}
                          </span>
                          <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                            <Star size={12} fill="currentColor" /> 4.8
                          </span>
                        </div>
                        <h5 className="card-title fw-bold text-dark mb-3">{item.title}</h5>
                        <button className="btn btn-primary w-100 py-2 d-flex justify-content-center align-items-center gap-2">
                          <Calendar size={18} /> Book Now
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-5 bg-dark text-white text-center position-relative overflow-hidden" id="how-it-works">
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'linear-gradient(45deg, var(--primary), var(--secondary))', opacity: 0.1}}></div>
        <div className="container py-5 position-relative z-1">
          <h2 className="display-5 fw-bold mb-4">Have Items Gathering Dust?</h2>
          <p className="lead mb-4 text-light">List your items today and start earning passive income.</p>
          <Link to="/register" className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold text-primary">Become an Owner</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
