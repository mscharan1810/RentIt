import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, ShieldCheck, Check, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`https://server-ten-pi-36.vercel.app/api/items/${id}`);
        if (data.item) {
          setItem(data.item);
          setReviews(data.reviews || []);
        } else {
          setItem(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching item', error);
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const calculateTotal = () => {
    if (!dates.start || !dates.end || !item) return 0;
    const start = new Date(dates.start);
    const end = new Date(dates.end);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * item.pricePerDay : 0;
  };

  const handleBook = async () => {
    const userInfoString = localStorage.getItem('userInfo');
    if (!userInfoString) {
      navigate('/login');
      return;
    }
    
    if (!dates.start || !dates.end) {
      alert('Please select both pickup and return dates.');
      return;
    }

    try {
      const userInfo = JSON.parse(userInfoString);
      const totalAmount = calculateTotal();
      
      await axios.post('https://server-ten-pi-36.vercel.app/api/bookings', {
        itemId: item._id,
        startDate: dates.start,
        endDate: dates.end,
        totalAmount: totalAmount,
        deposit: item.deposit
      }, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });
      
      const contactMsg = item.contactNumber ? ` Please contact the owner at ${item.contactNumber}.` : '';
      alert(`Booking request for ${item.title} sent to the owner!${contactMsg}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating booking', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to create booking: ${errorMsg}. Please try again.`);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!item) return <div className="text-center py-5">Item not found</div>;

  return (
    <div className="container py-5">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-link text-dark text-decoration-none d-inline-flex align-items-center mb-4 p-0 fw-medium"
      >
        <ArrowLeft size={20} className="me-2" /> Go Back
      </button>
      <div className="row g-5">
        <div className="col-lg-8">
          <div className="mb-4">
            {item.images && item.images.length > 1 ? (
              <div className="row g-2">
                <div className="col-12">
                  <img src={item.images[0]} alt={item.title} className="w-100 rounded-4" style={{maxHeight: '400px', objectFit: 'cover'}} />
                </div>
                <div className="d-flex gap-2 mt-2 overflow-auto pb-2">
                  {item.images.slice(1).map((img, idx) => (
                    <img key={idx} src={img} alt={`${item.title} ${idx+2}`} className="rounded-3" style={{height: '100px', width: '150px', objectFit: 'cover', flexShrink: 0}} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card overflow-hidden rounded-4">
                <img src={item.images[0]} alt={item.title} className="w-100" style={{maxHeight: '500px', objectFit: 'cover'}} />
              </div>
            )}
          </div>
          
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h1 className="fw-bold mb-2">{item.title}</h1>
              <div className="d-flex gap-3 text-muted">
                <span className="d-flex align-items-center gap-1"><MapPin size={18} /> {item.location || 'Local'}</span>
                <span className="d-flex align-items-center gap-1 text-warning"><Star fill="currentColor" size={18} /> 4.8 (12 reviews)</span>
              </div>
            </div>
          </div>
          
          <hr />
          
          <div className="py-4">
            <h4 className="fw-bold mb-3">Description</h4>
            <p className="text-muted lh-lg">{item.description}</p>
          </div>
          
          <hr />
          
          <div className="py-4 d-flex align-items-center gap-3">
            <img src={`https://ui-avatars.com/api/?name=${item.ownerId?.name || 'Owner'}&background=random`} alt="Owner" className="rounded-circle" width="60" />
            <div>
              <h5 className="mb-1 fw-bold">Owned by {item.ownerId?.name || 'Local User'}</h5>
              <p className="text-muted mb-0 small"><ShieldCheck size={14} className="text-success" /> Identity Verified</p>
              <p className="text-dark mt-2 mb-0 fw-medium"><MapPin size={16} className="me-1 text-primary" /> Pick up location: {item.location || 'Not specified'}</p>
              {item.googleMapLink && (
                <a href={item.googleMapLink} target="_blank" rel="noreferrer" className="d-inline-block mt-1 text-primary fw-medium small text-decoration-none border border-primary px-2 py-1 rounded-pill">
                  Open in Google Maps
                </a>
              )}
            </div>
          </div>
          
          <hr />
          
          <div className="py-4">
            <h4 className="fw-bold mb-4">Reviews from Renters</h4>
            {reviews && reviews.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {reviews.map(review => (
                  <div key={review._id} className="glass-card p-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold">{review.userId?.name || 'Anonymous'}</span>
                      <span className="text-warning d-flex align-items-center gap-1"><Star size={14} fill="currentColor"/> {review.renterReview?.rating}/5</span>
                    </div>
                    <p className="text-muted mb-0 small">"{review.renterReview?.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted italic">No reviews yet for this item.</p>
            )}
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="glass-card p-4 position-sticky" style={{top: '100px'}}>
            <h3 className="fw-bold mb-4">₹{item.pricePerDay} <span className="fs-6 text-muted fw-normal">/ day</span></h3>
            
            <div className="mb-4">
              <label className="form-label fw-semibold">Pickup Date</label>
              <input type="date" className="form-control mb-3" value={dates.start} onChange={(e) => setDates({...dates, start: e.target.value})} />
              
              <label className="form-label fw-semibold">Return Date</label>
              <input type="date" className="form-control" value={dates.end} onChange={(e) => setDates({...dates, end: e.target.value})} />
            </div>
            
            {dates.start && dates.end && calculateTotal() > 0 && (
              <div className="bg-light p-3 rounded-3 mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">₹{item.pricePerDay} x {calculateTotal() / item.pricePerDay} days</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Security Deposit</span>
                  <span>₹{item.deposit}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total (includes deposit)</span>
                  <span>₹{calculateTotal() + item.deposit}</span>
                </div>
              </div>
            )}
            
            <button onClick={handleBook} className="btn btn-primary w-100 py-3 fw-bold fs-5 shadow-lg">Request to Book</button>
            <p className="text-center text-muted small mt-3">You won't be charged yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
