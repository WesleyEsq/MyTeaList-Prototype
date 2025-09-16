import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { getListById } from '../services/listService.js';
import { getUserProfile } from '../services/userService.js';
import { updateRowOrder } from '../services/rowService.js';
import Spinner from '../components/Spinner.jsx';
import AddRowModal from '../components/AddRowModal.jsx';
import EditListModal from '../components/EditListModal.jsx';
import EditRowModal from '../components/EditRowModal.jsx';
import ListDetailCard from '../components/ListDetailCard.jsx';
import TableRow from '../components/TableRow.jsx';
import '../styles/ListPage.css';

// --- Iconos ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

function ListPage({ currentUser }) {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [author, setAuthor] = useState(null);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // NUEVO: Estado para la búsqueda

  useEffect(() => {
    if (!listId) return;
    const unsubscribe = getListById(listId, async (listData) => {
      if (listData) {
        setList(listData);
        setRows(listData.rows || []);
        if (listData.authorId) {
          const authorData = await getUserProfile(listData.authorId);
          setAuthor(authorData);
        }
      } else {
        setList(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [listId]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = rows.findIndex((item) => item.id === active.id);
      const newIndex = rows.findIndex((item) => item.id === over.id);
      const newOrderedRows = arrayMove(rows, oldIndex, newIndex);
      setRows(newOrderedRows);
      updateRowOrder(listId, newOrderedRows);
    }
  };

  // NUEVO: Filtra las filas basándose en el término de búsqueda
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter(row =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rows, searchTerm]);
  
  if (isLoading) { return <Spinner />; }
  if (!list) { /* ... (código de lista no encontrada) ... */ }
  
  const isAuthor = currentUser && currentUser.uid === list.authorId;

  return (
    <>
      {isAddRowModalOpen && <AddRowModal listId={listId} userId={currentUser.uid} onClose={() => setIsAddRowModalOpen(false)} />}
      {isEditListModalOpen && <EditListModal list={list} onClose={() => setIsEditListModalOpen(false)} />}
      {editingRow && <EditRowModal listId={listId} rowData={editingRow} onClose={() => setEditingRow(null)} />}

      <div className="list-page-container">
        <div className="page-actions-header">
          <button onClick={() => navigate(-1)} className="back-button-standalone"><BackIcon /> Back</button>
          <div className="search-and-add">
            <div className="search-bar">
              <SearchIcon />
              <input 
                type="text" 
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isAuthor && (
              <button className="add-row-btn" onClick={() => setIsAddRowModalOpen(true)}>
                <PlusIcon /> Add New Entry
              </button>
            )}
          </div>
        </div>
        <div className="list-content-grid">
          <aside className="list-details-column">
            <ListDetailCard list={list} author={author} isAuthor={isAuthor} onEditClick={() => setIsEditListModalOpen(true)} />
          </aside>
          <main className="list-table-column">
            <div className="list-table-container">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className={`list-table ${isAuthor ? 'is-author' : ''}`}>
                  <div className="table-header">
                    {isAuthor && <div className="table-cell grabber-header"></div>}
                    <div className="table-cell pos">#</div>
                    <div className="table-cell name">Title</div>
                    <div className="table-cell desc">Comment</div>
                    <div className="table-cell extra">Rank</div>
                    {isAuthor && <div className="table-cell actions"></div>}
                  </div>
                  <SortableContext items={rows.map(row => row.id)} strategy={verticalListSortingStrategy}>
                    <div className="table-body">
                      {filteredRows.length > 0 ? filteredRows.map((row, index) => (
                        <TableRow key={row.id} row={row} index={rows.indexOf(row)} isAuthor={isAuthor} onEdit={setEditingRow} />
                      )) : (
                        <div className="table-row-placeholder">
                          <p>{searchTerm ? "No entries match your search." : "This list is empty."}</p>
                          {isAuthor && !searchTerm && <span>Click "Add New Entry" to get started.</span>}
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </div>
              </DndContext>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default ListPage;

