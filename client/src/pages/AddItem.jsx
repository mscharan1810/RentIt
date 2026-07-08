import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

const AddItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    customCategory: '',
    pricePerDay: '',
    deposit: '',
    location: '',
    googleMapLink: '',
    contactNumber: '',
    imageUrls: ''
  });
  const [localImages, setLocalImages] = useState([]);
  const [existingBase64Images, setExistingBase64Images] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (isEditMode) {
      if (location.state?.item) {
        const item = location.state.item;
        let cat = item.category || 'Electronics';
        let customCat = '';
        if (item.category && !['Electronics', 'Cameras', 'Drones', 'Gaming', 'Power Tools', 'Party Items', 'Sports'].includes(item.category)) {
          cat = 'Others';
          customCat = item.category;
        }
        
        const defaultImg = 'https://images.unsplash.com/photo-1580870058473-8cb949bc5392?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        let normalImgs = [];
        let base64Imgs = [];
        if (Array.isArray(item.images)) {
          item.images.forEach(img => {
            if (img.startsWith('data:image/')) {
              base64Imgs.push(img);
            } else if (img !== defaultImg) {
              normalImgs.push(img);
            }
          });
        } else if (item.images) {
          if (item.images.startsWith('data:image/')) {
            base64Imgs.push(item.images);
          } else if (item.images !== defaultImg) {
            normalImgs.push(item.images);
          }
        }
        
        setExistingBase64Images(base64Imgs);
        let imgStr = normalImgs.join(', ');
        
        setFormData({
          title: item.title || '',
          description: item.description || '',
          category: cat,
          customCategory: customCat,
          pricePerDay: item.pricePerDay || '',
          deposit: item.deposit || '',
          location: item.location || '',
          googleMapLink: item.googleMapLink || '',
          contactNumber: item.contactNumber || '',
          imageUrls: imgStr
        });
      } else {
        const fetchItem = async () => {
          try {
            const { data } = await axios.get(`https://server-ten-pi-36.vercel.app/api/items/${id}`);
            const item = data.item || data;
            
            let cat = item.category || 'Electronics';
            let customCat = '';
            if (item.category && !['Electronics', 'Cameras', 'Drones', 'Gaming', 'Power Tools', 'Party Items', 'Sports'].includes(item.category)) {
              cat = 'Others';
              customCat = item.category;
            }
            
            const defaultImg = 'https://images.unsplash.com/photo-1580870058473-8cb949bc5392?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
            let normalImgs = [];
            let base64Imgs = [];
            if (Array.isArray(item.images)) {
              item.images.forEach(img => {
                if (img.startsWith('data:image/')) {
                  base64Imgs.push(img);
                } else if (img !== defaultImg) {
                  normalImgs.push(img);
                }
              });
            } else if (item.images) {
              if (item.images.startsWith('data:image/')) {
                base64Imgs.push(item.images);
              } else if (item.images !== defaultImg) {
                normalImgs.push(item.images);
              }
            }
            
            setExistingBase64Images(base64Imgs);
            let imgStr = normalImgs.join(', ');
            
            setFormData({
              title: item.title || '',
              description: item.description || '',
              category: cat,
              customCategory: customCat,
              pricePerDay: item.pricePerDay || '',
              deposit: item.deposit || '',
              location: item.location || '',
              googleMapLink: item.googleMapLink || '',
              contactNumber: item.contactNumber || '',
              imageUrls: imgStr
            });
          } catch (error) {
            console.error("Error fetching item to edit:", error);
          }
        };
        fetchItem();
      }
    }
  }, [id, isEditMode, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      let finalCategory = formData.category;
      if (formData.category === 'Others' && formData.customCategory.trim() !== '') {
        finalCategory = formData.customCategory.trim();
      }

      let imageArray = [];
      if (formData.imageUrls && formData.imageUrls.trim() !== '') {
        imageArray = formData.imageUrls.split(',').map(url => url.trim()).filter(url => url !== '');
      }
      
      if (localImages.length > 0) {
        // If they upload a new local image, it REPLACES the old base64 images
        imageArray = [...imageArray, ...localImages];
      } else if (existingBase64Images.length > 0) {
        // If no new local images, keep the old base64 images
        imageArray = [...imageArray, ...existingBase64Images];
      }
      
      if (imageArray.length === 0) {
        imageArray = ['https://images.unsplash.com/photo-1580870058473-8cb949bc5392?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'];
      }
      
      const payload = {
        title: formData.title,
        description: formData.description,
        category: finalCategory,
        pricePerDay: formData.pricePerDay,
        deposit: formData.deposit,
        location: formData.location,
        googleMapLink: formData.googleMapLink,
        contactNumber: formData.contactNumber,
        images: imageArray
      };

      if (isEditMode) {
        await axios.put(`https://server-ten-pi-36.vercel.app/api/items/${id}`, payload, config);
        alert('Item updated successfully!');
      } else {
        await axios.post('https://server-ten-pi-36.vercel.app/api/items', payload, config);
        alert('Item listed successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving item:', error);
      alert(error.response?.data?.message || `Failed to save item. Error: ${error.message}`);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImages(prev => [...prev, reader.result]);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    });
  };

  const categories = ['Electronics', 'Cameras', 'Drones', 'Gaming', 'Power Tools', 'Party Items', 'Sports', 'Others'];

  return (
    <div className="container py-5">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-link text-dark text-decoration-none d-inline-flex align-items-center mb-4 p-0 fw-medium"
      >
        <ArrowLeft size={20} className="me-2" /> Go Back
      </button>
      <div className="auth-card mx-auto" style={{maxWidth: '600px'}}>
        <h2 className="fw-bold mb-4">{isEditMode ? 'Edit Listing' : 'List a New Item'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea className="form-control" rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category</label>
              <select className="form-control mb-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {formData.category === 'Others' && (
                <input type="text" className="form-control" placeholder="Specify category" required value={formData.customCategory} onChange={e => setFormData({...formData, customCategory: e.target.value})} />
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Pick Up Location (City, Area)</label>
              <input type="text" className="form-control mb-2" required placeholder="e.g. Indiranagar, Bengaluru" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              <input type="text" className="form-control" placeholder="Optional Google Maps Link" value={formData.googleMapLink} onChange={e => setFormData({...formData, googleMapLink: e.target.value})} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Contact Number (For Renters)</label>
            <input type="text" className="form-control" required placeholder="e.g. 9876543210" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} />
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Price per Day (₹)</label>
              <input type="number" className="form-control" required value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Security Deposit (₹)</label>
              <input type="number" className="form-control" required value={formData.deposit} onChange={e => setFormData({...formData, deposit: e.target.value})} />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Image URLs (Optional, Comma separated)</label>
            <input type="text" className="form-control mb-3" placeholder="https://image1.jpg, https://image2.jpg" value={formData.imageUrls} onChange={e => setFormData({...formData, imageUrls: e.target.value})} />
            
            {existingBase64Images.length > 0 && (
              <div className="text-success small fw-medium mb-3">
                ✓ {existingBase64Images.length} previously uploaded local image(s) are preserved.
              </div>
            )}
            
            <div className="text-center text-muted fw-bold my-2">OR</div>
            
            <label className="form-label fw-semibold">Upload Local Images (Optional)</label>
            <input type="file" className="form-control mb-2" multiple accept="image/*" onChange={handleImageUpload} />
            {localImages.length > 0 && (
              <div className="text-muted small mb-2">{localImages.length} local image(s) selected</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100 py-3">{isEditMode ? 'Update Listing' : 'Publish Listing'}</button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
