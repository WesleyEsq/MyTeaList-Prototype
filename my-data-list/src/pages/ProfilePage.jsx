import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserLists } from '../services/listService.js';
import Spinner from '../components/Spinner.jsx';
import EditProfileModal from '../components/EditProfileModal.jsx';
import CreateListModal from '../components/CreateListModal.jsx';
import ListCard from '../components/ListCard.jsx';
import ThemeSelectorModal from '../components/ThemeSelectorModal.jsx';
import ProfileActions from '../components/ProfileActions.jsx'; // Importamos el nuevo componente
import '../styles/ProfilePage.css';


function ProfilePage({ user, onProfileUpdate, onThemeChange, currentTheme }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [lists, setLists] = useState([]);
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = getUserLists(user.uid, (userLists) => {
        setLists(userLists);
        setIsLoadingLists(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className="profile-page-container">
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdate={onProfileUpdate}
        />
      )}

      {/* Renderizado del nuevo modal */}
      {isThemeModalOpen && (
        <ThemeSelectorModal
          user={user}
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
          onClose={() => setIsThemeModalOpen(false)}
        />
      )}


      {isCreateListModalOpen && (
        <CreateListModal
          user={user}
          onClose={() => setIsCreateListModalOpen(false)}
          onListCreated={() => setIsCreateListModalOpen(false)}
        />
      )}
      <div className="profile-card">
        <div className="profile-banner">
          {user.bannerURL && <img src={user.bannerURL} alt="Banner de perfil" />}
        </div>
          <div className="profile-card-content">
          {/* REEMPLAZAMOS los botones anteriores con el nuevo componente */}
          <ProfileActions 
            onEditProfile={() => setIsEditModalOpen(true)}
            onThemeSelect={() => setIsThemeModalOpen(true)}
          />
          <div className="profile-picture-container">
            <img
              src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
              alt="Perfil"
              className="profile-picture"
            />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user.displayName || 'Usuario'}</h2>
            <p className="profile-email">{user.email}</p>
          </div>
          {user.aboutMe && <p className="about-me">{user.aboutMe}</p>}
        </div>
      </div>
      <div className="lists-dashboard">
        <div className="dashboard-header">
          <h3>Mis Listas</h3>
          <button className="create-list-btn" onClick={() => setIsCreateListModalOpen(true)}>
            Crear Lista
          </button>
        </div>
        {isLoadingLists ? (
          <div className="lists-loading-container"><Spinner /></div>
        ) : (
          <div className="lists-grid">
            {lists.length > 0 ? (
              lists.map(list => (
                <ListCard key={list.id} list={list} onClick={() => navigate(`/list/${list.id}`)} />
              ))
            ) : (
              <div className="list-card-placeholder" onClick={() => setIsCreateListModalOpen(true)}>
                <p>No tienes listas todavía.</p>
                <span>¡Haz clic aquí para crear la primera!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
