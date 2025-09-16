import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/homePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Un componente simple de navegación para movernos durante el desarrollo
function Navigation() {
  return (
    <nav style={{ 
      backgroundColor: '#f0f0f0', 
      padding: '1rem', 
      marginBottom: '1rem', 
      borderRadius: '8px',
      border: '1px solid #ddd'
    }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
      <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
      <Link to="/profile/testuser">Profile (test)</Link>
    </nav>
  );
}

function App() {
  return (
    <div className="app-container">
      <h1>MyTeaList</h1>
      <Navigation />
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Ruta dinámica para perfiles de usuario */}
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
