import React from 'react';
import '../styles/RowDetail.css';

const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;

function RowDetail({ row }) {
  return (
    <div className="table-row-detail-container">
      <div className="row-detail-content">
        <div className="row-detail-image-container">
          {row.imageURL ? (
            <img src={row.imageURL} alt={row.name} />
          ) : (
            <div className="row-detail-image-placeholder">
              <ImageIcon />
              <span>No Image</span>
            </div>
          )}
        </div>
        <div className="row-detail-text">
          <h3>Notes / Details</h3>
          <p>{row.bigDescription || 'No additional details provided.'}</p>
        </div>
      </div>
    </div>
  );
}

export default RowDetail;
