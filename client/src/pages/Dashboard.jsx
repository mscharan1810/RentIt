import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Star, CheckCircle, XCircle, CreditCard, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [userItems, setUserItems] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');
  
  const [reviewForm, setReviewForm] = useState({ bookingId: null, role: '', rating: 5, comment: '' });

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      const fetchData = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          
          const [itemsRes, bookingsRes, ownerBookingsRes] = await Promise.all([
            axios.get('http://localhost:5000/api/items'),
            axios.get('http://localhost:5000/api/bookings/mybookings', config).catch(() => ({ data: [] })),
            axios.get('http://localhost:5000/api/bookings/ownerbookings', config).catch(() => ({ data: [] }))
          ]);
          
          const myItems = itemsRes.data.filter(item => {
            if (!item.ownerId) return false;
            const idToCompare = typeof item.ownerId === 'string' ? item.ownerId : item.ownerId._id;
            return idToCompare === userInfo._id;
          });
          setUserItems(myItems);
          setUserBookings(bookingsRes.data);
          setOwnerBookings(ownerBookingsRes.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data', error);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [navigate]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, { status: newStatus }, config);
      
      setOwnerBookings(prev => 
        prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
      );
      alert(`Booking ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating booking status', error);
      alert('Failed to update status.');
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/pay`, {}, config);
      
      setOwnerBookings(prev => 
        prev.map(b => b._id === bookingId ? { ...b, paymentStatus: 'paid', status: 'completed' } : b)
      );
      alert('Payment confirmed! Transaction complete.');
    } catch (error) {
      console.error('Payment confirmation error', error);
      alert('Failed to confirm payment.');
    }
  };

  const handleCancelRenterBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, { status: 'cancelled' }, config);
        
        setUserBookings(prev => 
          prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b)
        );
        alert('Request cancelled successfully.');
      } catch (error) {
        console.error('Error cancelling request', error);
        alert('Failed to cancel request.');
      }
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/items/${itemId}`, config);
        
        setUserItems(prev => prev.filter(item => item._id !== itemId));
        alert('Item deleted successfully!');
      } catch (error) {
        console.error('Error deleting item', error);
        alert(error.response?.data?.message || 'Failed to delete item.');
      }
    }
  };

  const submitReview = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { bookingId, role, rating, comment } = reviewForm;
      const { data } = await axios.post(`http://localhost:5000/api/bookings/${bookingId}/review`, { role, rating, comment }, config);
      
      if (role === 'renter') {
        setUserBookings(prev => prev.map(b => b._id === bookingId ? data : b));
      } else {
        setOwnerBookings(prev => prev.map(b => b._id === bookingId ? data : b));
      }
      
      alert('Review submitted successfully!');
      setReviewForm({ bookingId: null, role: '', rating: 5, comment: '' });
    } catch (error) {
      console.error('Review error', error);
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (!userInfo) return null;

  return (
    <div className="container py-5">
      <div className="row mb-5 align-items-center">
        <div className="col-md-8">
          <h1 className="fw-bold">Welcome back, {userInfo.name}! 👋</h1>
          <p className="text-muted lead">Manage your rentals and bookings from your personal dashboard.</p>
        </div>
        <div className="col-md-4 text-md-end mt-4 mt-md-0">
          <Link to="/add-item" className="btn btn-primary btn-lg shadow-md">+ List New Item</Link>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <div className="glass-card p-4 text-center h-100">
            <div className="display-4 fw-bold text-primary mb-2">{userBookings.length}</div>
            <h5 className="text-muted">My Rentals</h5>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="glass-card p-4 text-center h-100">
            <div className="display-4 fw-bold text-secondary mb-2">{userItems.length}</div>
            <h5 className="text-muted">My Listings</h5>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="glass-card p-4 text-center h-100">
            <div className="display-4 fw-bold text-success mb-2">{ownerBookings.filter(b => b.status === 'completed' || b.paymentStatus === 'paid').length}</div>
            <h5 className="text-muted">Completed Transactions</h5>
          </div>
        </div>
      </div>
      
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button className={`nav-link rounded-pill px-4 fw-medium ${activeTab === 'listings' ? 'active' : 'bg-light text-dark'}`} onClick={() => setActiveTab('listings')}>My Listings</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link rounded-pill px-4 fw-medium ${activeTab === 'myBookings' ? 'active' : 'bg-light text-dark'}`} onClick={() => setActiveTab('myBookings')}>My Rentals (As Renter)</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link rounded-pill px-4 fw-medium ${activeTab === 'requests' ? 'active' : 'bg-light text-dark'}`} onClick={() => setActiveTab('requests')}>Incoming Requests (As Owner)</button>
        </li>
      </ul>
      
      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : activeTab === 'listings' ? (
        userItems.length === 0 ? (
          <div className="glass-card p-5 text-center">
            <h4 className="fw-bold mb-3">You don't have any listings yet</h4>
            <Link to="/add-item" className="btn btn-primary px-4 py-2">List an Item</Link>
          </div>
        ) : (
          <div className="row g-4">
            {userItems.map(item => (
              <div key={item._id} className="col-12 col-md-6 col-lg-3">
                <Link to={`/item/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card item-card glass-card h-100 cursor-pointer">
                    <div className="item-img-wrapper">
                      <img src={item.images[0]} alt={item.title} className="item-img" />
                      <div className="price-badge">₹{item.pricePerDay}/day</div>
                    </div>
                    <div className="card-body p-4 d-flex flex-column">
                      <h5 className="card-title fw-bold text-dark mb-2">{item.title}</h5>
                      <span className="text-muted small d-flex align-items-center gap-1 mb-3">
                        <MapPin size={14} className="flex-shrink-0" /> 
                        <span className="text-truncate">{item.location || 'Local'}</span>
                      </span>
                      
                      <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top gap-2 flex-wrap">
                        <span className="badge bg-success px-3 py-2 rounded-pill fw-medium">Active</span>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary px-3 rounded-pill fw-medium"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/edit-item/${item._id}`, { state: { item } });
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger px-3 rounded-pill fw-medium"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteItem(item._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'myBookings' ? (
        userBookings.length === 0 ? (
          <div className="glass-card p-5 text-center">
            <h4 className="fw-bold mb-3">You haven't rented anything yet</h4>
            <Link to="/" className="btn btn-primary px-4 py-2">Browse Items</Link>
          </div>
        ) : (
          <div className="row g-4">
            {userBookings.map(booking => (
              <div key={booking._id} className="col-12">
                <div className="glass-card p-4 d-flex flex-column flex-md-row gap-4">
                  {booking.itemId && <img src={booking.itemId.images[0]} alt="Item" className="rounded-3" style={{width: '120px', height: '120px', objectFit: 'cover'}} />}
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold mb-0">{booking.itemId?.title || 'Unknown Item'}</h5>
                      <div className="d-flex flex-column align-items-end gap-1">
                        <span className={`badge bg-${booking.status === 'pending' ? 'warning' : booking.status === 'approved' ? 'primary' : booking.status === 'completed' ? 'success' : 'danger'}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="row mt-3 mb-4 bg-light p-3 rounded-3 mx-0">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <h6 className="text-muted small fw-bold text-uppercase mb-2">Rental Period</h6>
                        <p className="mb-1 small text-dark"><Calendar size={14} className="me-1 text-primary" /> <strong>Start:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
                        <p className="mb-1 small text-dark"><Calendar size={14} className="me-1 text-primary" /> <strong>End:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
                        <p className="mb-0 small text-muted mt-2">Requested on: {new Date(booking.createdAt).toLocaleDateString()} {new Date(booking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div className="col-md-6 border-start-md">
                        <h6 className="text-muted small fw-bold text-uppercase mb-2">Payment Details</h6>
                        <div className="d-flex justify-content-between gap-3 mb-1 small text-dark">
                          <span>Rental Fee:</span>
                          <span className="fw-medium">₹{booking.totalAmount}</span>
                        </div>
                        <div className="d-flex justify-content-between gap-3 mb-1 small text-dark">
                          <span>Deposit:</span>
                          <span className="fw-medium">₹{booking.deposit}</span>
                        </div>
                        <div className="d-flex justify-content-between gap-3 pt-2 border-top mt-2">
                          <span className="fw-bold text-dark">Total Cost:</span>
                          <strong className="text-success">₹{booking.totalAmount + booking.deposit}</strong>
                        </div>
                      </div>
                    </div>
                    
                    {booking.status === 'approved' && booking.paymentStatus === 'pending' && (
                      <p className="text-primary small mb-3 fw-medium">Waiting for owner to confirm payment.</p>
                    )}

                    {(booking.status === 'pending' || (booking.status === 'approved' && booking.paymentStatus === 'pending')) && (
                      <button onClick={() => handleCancelRenterBooking(booking._id)} className="btn btn-outline-danger btn-sm mb-3 d-flex align-items-center gap-1">
                        <XCircle size={16}/> Cancel Request
                      </button>
                    )}
                    
                    {booking.paymentStatus === 'paid' && !booking.renterReview && reviewForm.bookingId !== booking._id && (
                      <button onClick={() => setReviewForm({ bookingId: booking._id, role: 'renter', rating: 5, comment: '' })} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2">
                        <MessageSquare size={16}/> Leave a Review for Owner
                      </button>
                    )}
                    
                    {(booking.ownerReview || booking.renterReview) && (
                      <div className="mt-4 pt-3 border-top">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><MessageSquare size={16} className="text-primary"/> Reviews</h6>
                        <div className="d-flex flex-column gap-3">
                          {booking.ownerReview && (
                            <div className="bg-white border p-3 rounded-3 shadow-sm">
                              <p className="mb-1 fw-bold text-dark d-flex align-items-center gap-1">Owner's Review <Star size={14} className="text-warning" fill="currentColor"/> {booking.ownerReview.rating}/5</p>
                              <p className="mb-0 text-muted small">"{booking.ownerReview.comment}"</p>
                            </div>
                          )}
                          {booking.renterReview && (
                            <div className="bg-light p-3 rounded-3 border">
                              <p className="mb-1 fw-bold text-dark d-flex align-items-center gap-1">Your Review <Star size={14} className="text-warning" fill="currentColor"/> {booking.renterReview.rating}/5</p>
                              <p className="mb-0 text-muted small">"{booking.renterReview.comment}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {reviewForm.bookingId === booking._id && reviewForm.role === 'renter' && (
                      <div className="bg-light p-3 rounded-3 mt-3 border border-primary">
                        <h6 className="fw-bold mb-2">Write Review</h6>
                        <div className="mb-2">
                          <label className="form-label small">Rating (1-5)</label>
                          <input type="number" min="1" max="5" className="form-control form-control-sm" value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: e.target.value})} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small">Comment</label>
                          <textarea className="form-control form-control-sm" rows="2" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}></textarea>
                        </div>
                        <div className="d-flex gap-2">
                          <button onClick={submitReview} className="btn btn-primary btn-sm">Submit</button>
                          <button onClick={() => setReviewForm({bookingId: null, role: '', rating: 5, comment: ''})} className="btn btn-light btn-sm">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        ownerBookings.length === 0 ? (
          <div className="glass-card p-5 text-center">
            <h4 className="fw-bold mb-3">No incoming requests yet</h4>
            <p className="text-muted">When someone requests to rent your items, they will appear here.</p>
          </div>
        ) : (
          <div className="row g-4">
            {ownerBookings.map(booking => (
              <div key={booking._id} className="col-12">
                <div className="glass-card p-4 d-flex flex-column flex-md-row align-items-md-center gap-4">
                  {booking.itemId && <img src={booking.itemId.images[0]} alt="Item" className="rounded-3" style={{width: '120px', height: '120px', objectFit: 'cover'}} />}
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold mb-0">{booking.itemId?.title || 'Unknown Item'}</h5>
                      <div className="d-flex flex-column align-items-end gap-1">
                        <span className={`badge bg-${booking.status === 'pending' ? 'warning' : booking.status === 'approved' ? 'primary' : booking.status === 'completed' ? 'success' : 'danger'}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="row mt-3 mb-4 bg-light p-3 rounded-3 mx-0">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <h6 className="text-muted small fw-bold text-uppercase mb-2">Renter Details</h6>
                        <p className="mb-1 fw-bold text-dark d-flex align-items-center">
                          {booking.userId?.name}
                          {booking.userId?.averageRating && (
                            <span className="ms-2 badge bg-warning text-dark align-text-bottom"><Star size={10} fill="currentColor" className="me-1" />{booking.userId.averageRating} ({booking.userId.reviewCount} reviews)</span>
                          )}
                        </p>
                        <p className="mb-1 small text-dark">📞 {booking.userId?.phone || 'No phone provided'}</p>
                        <p className="mb-0 small text-dark">✉️ {booking.userId?.email || 'No email provided'}</p>
                      </div>
                      <div className="col-md-6 border-start-md">
                        <h6 className="text-muted small fw-bold text-uppercase mb-2">Rental Period</h6>
                        <p className="mb-1 small text-dark"><Calendar size={14} className="me-1 text-primary" /> <strong>Start:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
                        <p className="mb-1 small text-dark"><Calendar size={14} className="me-1 text-primary" /> <strong>End:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
                        <p className="mb-0 small text-muted mt-2">Requested on: {new Date(booking.createdAt).toLocaleDateString()} {new Date(booking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </div>
                    
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {booking.status === 'pending' && (
                        <>
                          <button onClick={() => handleUpdateStatus(booking._id, 'approved')} className="btn btn-success btn-sm d-flex align-items-center gap-1"><CheckCircle size={16}/> Approve Request</button>
                          <button onClick={() => handleUpdateStatus(booking._id, 'rejected')} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"><XCircle size={16}/> Reject Request</button>
                        </>
                      )}
                      
                      {booking.status === 'approved' && booking.paymentStatus === 'pending' && (
                        <>
                          <button onClick={() => handlePayment(booking._id)} className="btn btn-primary btn-sm d-flex align-items-center gap-1"><CreditCard size={16}/> Confirm Payment Received</button>
                          <button onClick={() => handleUpdateStatus(booking._id, 'cancelled')} className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"><XCircle size={16}/> Cancel Booking</button>
                        </>
                      )}
                    </div>
                    
                    {booking.paymentStatus === 'paid' && !booking.ownerReview && reviewForm.bookingId !== booking._id && (
                      <button onClick={() => setReviewForm({ bookingId: booking._id, role: 'owner', rating: 5, comment: '' })} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 mt-2">
                        <MessageSquare size={16}/> Leave a Review for Renter
                      </button>
                    )}
                    
                    {(booking.ownerReview || booking.renterReview) && (
                      <div className="mt-4 pt-3 border-top">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><MessageSquare size={16} className="text-primary"/> Reviews</h6>
                        <div className="d-flex flex-column gap-3">
                          {booking.renterReview && (
                            <div className="bg-white border p-3 rounded-3 shadow-sm">
                              <p className="mb-1 fw-bold text-dark d-flex align-items-center gap-1">Renter's Review <Star size={14} className="text-warning" fill="currentColor"/> {booking.renterReview.rating}/5</p>
                              <p className="mb-0 text-muted small">"{booking.renterReview.comment}"</p>
                            </div>
                          )}
                          {booking.ownerReview && (
                            <div className="bg-light p-3 rounded-3 border">
                              <p className="mb-1 fw-bold text-dark d-flex align-items-center gap-1">Your Review <Star size={14} className="text-warning" fill="currentColor"/> {booking.ownerReview.rating}/5</p>
                              <p className="mb-0 text-muted small">"{booking.ownerReview.comment}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {reviewForm.bookingId === booking._id && reviewForm.role === 'owner' && (
                      <div className="bg-light p-3 rounded-3 mt-3 border border-primary">
                        <h6 className="fw-bold mb-2">Write Review</h6>
                        <div className="mb-2">
                          <label className="form-label small">Rating (1-5)</label>
                          <input type="number" min="1" max="5" className="form-control form-control-sm" value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: e.target.value})} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small">Comment</label>
                          <textarea className="form-control form-control-sm" rows="2" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}></textarea>
                        </div>
                        <div className="d-flex gap-2">
                          <button onClick={submitReview} className="btn btn-primary btn-sm">Submit</button>
                          <button onClick={() => setReviewForm({bookingId: null, role: '', rating: 5, comment: ''})} className="btn btn-light btn-sm">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-md-end mt-4 mt-md-0 border-start ps-md-4" style={{minWidth: '220px'}}>
                    <h6 className="text-muted small fw-bold text-uppercase mb-3 text-md-end">Payment Details</h6>
                    <div className="d-flex justify-content-between justify-content-md-end gap-4 mb-2 small text-dark">
                      <span>Rental Fee:</span>
                      <span className="fw-medium">₹{booking.totalAmount}</span>
                    </div>
                    <div className="d-flex justify-content-between justify-content-md-end gap-4 mb-3 small text-dark">
                      <span>Deposit:</span>
                      <span className="fw-medium">₹{booking.deposit}</span>
                    </div>
                    <div className="d-flex justify-content-between justify-content-md-end gap-4 pt-2 border-top">
                      <span className="fw-bold text-dark mt-1">Total:</span>
                      <h4 className="fw-bold text-success mb-0">₹{booking.totalAmount + booking.deposit}</h4>
                    </div>
                    
                    <div className="mt-4 text-md-end">
                      <span className={`badge bg-${booking.paymentStatus === 'paid' ? 'success' : 'secondary'} p-2 w-100`}>
                        {booking.paymentStatus === 'paid' ? <><CheckCircle size={14} className="me-1"/> PAYMENT RECEIVED</> : 'PAYMENT PENDING'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
