import React from 'react';
import '../styles/ListCard.css';

function ListCard({ list, onClick }) {
  return (
    <div className="list-card" onClick={onClick}>
      <div className="list-card-image-container">
        {list.coverImageURL ? (
          <img src={list.coverImageURL} alt={list.title} />
        ) : (
          <div className="list-card-placeholder-image"></div>
        )}
        <div className="list-card-overlay"></div>
      </div>
      <div className="list-card-content">
        <h3>{list.title}</h3>
      </div>
    </div>
  );
}

export default ListCard;
