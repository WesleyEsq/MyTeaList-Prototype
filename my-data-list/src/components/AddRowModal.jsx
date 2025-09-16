import React, { useState } from 'react';
import { addRowToList } from '../services/listService.js';
import Spinner from './Spinner.jsx';
import '../styles/CreateListModal.css';

const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;

function AddRowModal({ listId, userId, onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [extraField, setExtraField] = useState('');
  const [bigDescription, setBigDescription] = useState('');
  const [rowFile, setRowFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRowFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await addRowToList(listId, { name, description, extraField, bigDescription, rowFile }, userId);
      onClose(); // Simplemente cierra el modal al terminar
    } catch (err) {
      setError('Failed to add entry. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content create-list-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><CloseIcon /></button>
        <h2>Add New Entry to List</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="row-image-input" className="cover-image-uploader">
            {imagePreview ? (
              <img src={imagePreview} alt="Entry preview" className="cover-image-preview" />
            ) : (
              <div className="cover-image-placeholder">
                <ImageIcon />
                <span>Upload an image (optional)</span>
              </div>
            )}
          </label>
          <input id="row-image-input" type="file" accept="image/*" onChange={handleImageChange} />
          <div className="input-group-modal">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="input-group-modal">
            <label htmlFor="desc">Short Description</label>
            <input id="desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="input-group-modal">
            <label htmlFor="extra">Rating / Extra Field</label>
            <input id="extra" type="text" value={extraField} onChange={(e) => setExtraField(e.target.value)} />
          </div>
          <div className="input-group-modal">
            <label htmlFor="bigDesc">Long Description / Notes</label>
            <textarea id="bigDesc" value={bigDescription} onChange={(e) => setBigDescription(e.target.value)} rows="5" />
          </div>
          {error && <p className="error-message-modal">{error}</p>}
          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Item to List'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRowModal;
