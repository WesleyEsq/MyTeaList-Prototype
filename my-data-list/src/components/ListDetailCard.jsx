import React from 'react';
import '../styles/ListDetailCard.css';

// --- Icono ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

function ListDetailCard({ list, author, isAuthor, onEditClick }) {
  if (!list) return null;

  return (
    <div className="list-detail-card">
      <div className="list-detail-cover-image">
        {list.coverImageURL ? (
          <img src={list.coverImageURL} alt={list.title} />
        ) : (
          <div className="list-detail-placeholder-image"></div>
        )}
      </div>
      <div className="list-detail-content">
        
        {isAuthor && (
          <button className="edit-list-btn" onClick={onEditClick} title="Edit list details">
            <EditIcon />
          </button>
        )}

        <h2>{list.title}</h2>
        
        {/* NUEVO DISEÑO: Línea de autor sin imagen */}
        <div className="list-author-info">
          {author ? (
            <span className="author-byline">
              Post made by <strong>{author.displayName}</strong>
            </span>
          ) : (
            <div className="author-placeholder" /> 
          )}
        </div>

        {/* Separador para un mejor diseño */}
        <hr className="card-divider" />

        <p className="list-description">{list.description || "No description provided."}</p>
      </div>
    </div>
  );
}

export default ListDetailCard;

