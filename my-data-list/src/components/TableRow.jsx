import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import RowDetail from './RowDetail.jsx';

// --- Iconos ---
const EditRowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const GrabIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>;

function TableRow({ row, index, isAuthor, onEdit }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className={`table-row-wrapper ${isDragging ? 'dragging' : ''}`}>
      <div className={`table-row-content ${isExpanded ? 'expanded' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
        {isAuthor && (
          // listeners se aplica al ícono para que solo él sea el punto de agarre
          <div className="table-cell grabber" {...attributes} {...listeners}>
            <GrabIcon />
          </div>
        )}
        <div className="table-cell pos">{index + 1}</div>
        <div className="table-cell name">{row.name}</div>
        <div className="table-cell desc">{row.description}</div>
        <div className="table-cell extra">{row.extraField}</div>
        {isAuthor && (
          <div className="table-cell actions">
            <button className="action-btn edit-row" onClick={(e) => { e.stopPropagation(); onEdit(row); }} title="Edit Row">
              <EditRowIcon />
            </button>
          </div>
        )}
      </div>
      {isExpanded && <RowDetail row={row} />}
    </div>
  );
}

export default TableRow;

