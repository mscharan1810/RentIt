import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Star, MapPin, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Search = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('category') || '';
  
  const [query, setQuery] = useState(initialQuery);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get('category') || '');
  }, [location.search]);
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get('https://server-ten-pi-36.vercel.app/api/items');
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items', error);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => 
    (item.title && item.title.toLowerCase().includes(query.toLowerCase())) || 
    (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="container py-5">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-link text-dark text-decoration-none d-inline-flex align-items-center mb-4 p-0 fw-medium"
      >
        <ArrowLeft size={20} className="me-2" /> Go Back
      </button>
      <div className="row mb-5 align-items-center">
        <div className="col-lg-6">
          <h2 className="fw-bold mb-3">Explore Rentals</h2>
          <div className="search-bar w-100">
            <SearchIcon className="text-muted ms-3" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by name, category..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : (
        <div className="row g-4">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item._id} className="col-12 col-md-6 col-lg-3">
                <Link to={`/item/${item._id}`}>
                  <div className="card item-card glass-card h-100">
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
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h4 className="text-muted">No items found matching your search.</h4>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
