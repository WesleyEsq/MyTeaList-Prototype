import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateListDetails, deleteList } from '../services/listService.js';
import Spinner from './Spinner.jsx';
import '../styles/CreateListModal.css'; // Mantiene estilos base
import '../styles/EditListModal.css';   // Estilos específicos y overrides

// --- Iconos ---
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

function EditListModal({ list, onClose }) {
  const [title, setTitle] = useState(list.title);
  const [description, setDescription] = useState(list.description);
  const [newCoverFile, setNewCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(list.coverImageURL);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await updateListDetails(list.id, { title, description, newCoverFile });
      onClose();
    } catch (err) {
      setError('Failed to update list. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this list? All of its content will be permanently lost.")) {
      setIsDeleting(true);
      try {
        await deleteList(list.id);
        navigate('/'); // Redirige al perfil después de borrar
      } catch (err) {
        setError('Failed to delete list.');
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
          <button type="button" className="delete-icon-btn list-delete" onClick={handleDelete} disabled={isDeleting} title="Delete List">
            {isDeleting ? <Spinner isButtonSpinner={true} /> : <TrashIcon />}
          </button>
          <h2>Edit List Details</h2>
          <button className="close-btn" onClick={onClose}><CloseIcon /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="image-preview-wrapper edit-list-image">
            <label>Cover Image</label>
            <label htmlFor="cover-image-edit-input" className="current-image-container">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="current-image-preview" />
              ) : (
                <div className="current-image-placeholder">No Cover Image</div>
              )}
            </label>
            <label htmlFor="cover-image-edit-input" className="change-image-btn">
              Change Image
            </label>
            <input id="cover-image-edit-input" type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          
          <div className="input-group-modal">
            <label htmlFor="title-edit">List Title</label>
            <input id="title-edit" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="input-group-modal">
            <label htmlFor="description-edit">Description</label>
            <textarea id="description-edit" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
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

export default EditListModal;

