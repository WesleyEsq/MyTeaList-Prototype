import React, { useState } from 'react';
import { createList } from '../services/listService';
import '../styles/CreateListModal.css';

const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;

function CreateListModal({ user, onClose, onListCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await createList({ title, description, coverFile }, user.uid);
      onListCreated();
      onClose();
    } catch (err) {
      setError('Failed to create list. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content create-list-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><CloseIcon /></button>
        <h2>Create a New List</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="cover-image-input" className="cover-image-uploader">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="cover-image-preview" />
            ) : (
              <div className="cover-image-placeholder">
                <ImageIcon />
                <span>Upload a cover image (optional)</span>
              </div>
            )}
          </label>
          <input id="cover-image-input" type="file" accept="image/*" onChange={handleImageChange} />
          <div className="input-group-modal">
            <label htmlFor="title">List Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., My Favorite Sci-Fi Books"
              required
            />
          </div>
          <div className="input-group-modal">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short summary of what this list is about"
              rows="4"
            />
          </div>
          {error && <p className="error-message-modal">{error}</p>}
          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create List'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateListModal;
