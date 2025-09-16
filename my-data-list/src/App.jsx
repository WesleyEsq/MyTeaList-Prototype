import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.js';
import { getUserProfile } from './services/userService.js';


// Importación de Componentes y Páginas
import Header from './components/Header.jsx';
import Spinner from './components/Spinner.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ListPage from './pages/ListPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import { termsAndConditionsContent } from './legal/terms.js';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('teal'); // Tema por defecto

  // Listener de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const userProfile = await getUserProfile(userAuth.uid);
        setCurrentUser({ ...userAuth, ...userProfile });
        if (userProfile?.selectedTheme) {
          setTheme(userProfile.selectedTheme);
        } else {
          setTheme('teal');
        }
      } else {
        setCurrentUser(null);
        setTheme('teal');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // SOLUCIÓN: Este useEffect aplica el tema al <body> cada vez que cambia.
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Función para actualizar el estado del usuario cuando se edita el perfil
  const handleProfileUpdate = (updatedUserData) => {
    setCurrentUser(updatedUserData);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    // Ya no necesitamos el data-theme aquí
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route 
            path="/login" 
            element={!currentUser ? <AuthPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/terms" 
            element={<LegalPage title="Terms and Conditions" content={termsAndConditionsContent} />}
          />
          <Route 
            path="/list/:listId" 
            element={currentUser ? <ListPage currentUser={currentUser} /> : <Navigate to="/login" />}
          />
          <Route 
            path="/" 
            element={currentUser ? <ProfilePage user={currentUser} onProfileUpdate={handleProfileUpdate} onThemeChange={setTheme} currentTheme={theme} /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

