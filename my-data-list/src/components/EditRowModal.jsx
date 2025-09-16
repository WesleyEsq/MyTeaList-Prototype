import React, { useState } from 'react';
import { updateRowInList, deleteRowFromList } from '../services/rowService.js';
import { auth } from '../firebase.js';
import Spinner from './Spinner.jsx';
import '../styles/CreateListModal.css'; // Mantiene estilos base
import '../styles/EditRowModal.css';   // Estilos específicos y overrides

// --- Iconos ---
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

function EditRowModal({ listId, rowData, onClose }) {
  const [name, setName] = useState(rowData.name);
  const [description, setDescription] = useState(rowData.description);
  const [extraField, setExtraField] = useState(rowData.extraField);
  const [bigDescription, setBigDescription] = useState(rowData.bigDescription || '');
  const [newRowFile, setNewRowFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(rowData.imageURL);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewRowFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const updatedRow = { ...rowData, name, description, extraField, bigDescription };
      const userId = auth.currentUser.uid;
      await updateRowInList(listId, userId, updatedRow, newRowFile);
      onClose();
    } catch (err) {
      setError('Failed to update entry. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
      setIsDeleting(true);
      setError('');
      try {
        await deleteRowFromList(listId, rowData.id);
        onClose();
      } catch (err) {
        setError('Failed to delete entry. Please try again.');
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content create-list-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button type="button" className="delete-icon-btn" onClick={handleDelete} disabled={isDeleting} title="Delete Entry">
            {isDeleting ? <Spinner isButtonSpinner={true} /> : <TrashIcon />}
          </button>
          <h2>Edit Entry</h2>
          <button className="close-btn" onClick={onClose}><CloseIcon /></button>
        </div>
        
        <form onSubmit={handleUpdate}>
          <div className="image-preview-wrapper edit-row-image">
            <label>Entry Image</label>
            <div className="current-image-container">
              {imagePreview ? (
                <img src={imagePreview} alt={name} className="current-image-preview" />
              ) : (
                <div className="current-image-placeholder">No Image</div>
              )}
            </div>
            <label htmlFor="row-image-edit-input" className="change-image-btn">Change Image</label>
            <input id="row-image-edit-input" type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          
          <div className="input-group-modal">
            <label htmlFor="name-edit">Name</label>
            <input id="name-edit" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="input-group-modal">
            <label htmlFor="desc-edit">Short Description</label>
            <input id="desc-edit" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="input-group-modal">
            <label htmlFor="extra-edit">Rating / Extra Field</label>
            <input id="extra-edit" type="text" value={extraField} onChange={(e) => setExtraField(e.target.value)} />
          </div>
          <div className="input-group-modal">
            <label htmlFor="bigDesc-edit">Long Description / Notes</label>
            <textarea id="bigDesc-edit" value={bigDescription} onChange={(e) => setBigDescription(e.target.value)} rows="5" />
          </div>

          {error && <p className="error-message-modal">{error}</p>}
          
          <div className="modal-actions">
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? <Spinner isButtonSpinner={true}/> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRowModal;

