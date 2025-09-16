import React, { useState } from 'react';
import { updateUserProfile } from '../services/authService';
import '../styles/EditProfileModal.css';

const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

function EditProfileModal({ user, onClose, onProfileUpdate }) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [aboutMe, setAboutMe] = useState(user.aboutMe || '');
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user.photoURL);
  const [bannerPreview, setBannerPreview] = useState(user.bannerURL);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'profile') {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else if (type === 'banner') {
        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const updatedUser = await updateUserProfile(user, { displayName, aboutMe, imageFile, bannerFile });
      onProfileUpdate(updatedUser);
      onClose();
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><CloseIcon /></button>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="banner-uploader">
            <label htmlFor="banner-input" className="modal-label">Banner Image</label>
            <div className="banner-preview-container">
              {bannerPreview ? <img src={bannerPreview} alt="Banner Preview" className="banner-preview"/> : <div className="banner-preview-placeholder">No Banner</div>}
              <label htmlFor="banner-input" className="banner-overlay-text">
                Change Banner
              </label>
            </div>
            <input id="banner-input" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'banner')} />
          </div>
          <div className="image-uploader">
            <img 
              src={imagePreview || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`} 
              alt="Profile Preview" 
              className="profile-preview"
            />
            <label htmlFor="file-input" className="file-label">
              Change Photo
            </label>
            <input 
              id="file-input" 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, 'profile')} 
            />
          </div>
          <div className="input-group-modal">
            <label htmlFor="displayName" className="modal-label">Username</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your new username"
            />
          </div>
          <div className="input-group-modal">
            <label htmlFor="aboutMe" className="modal-label">About Me</label>
            <textarea
              id="aboutMe"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Tell us a little about yourself..."
              rows="5"
            />
          </div>
          {error && <p className="error-message-modal">{error}</p>}
          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
