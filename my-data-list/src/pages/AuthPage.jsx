import React from 'react';
import LoginRegisterForm from '../components/loginRegisterForm.jsx';
import '../styles/AuthPage.css';
import InfoCarousel from '../components/InfoCarousel.jsx'; 

function AuthPage() {
  // Este componente ya no necesita pasar props, App.js maneja el estado globalmente.
  return (
    <div className="auth-page-container">
      <div className="info-panel">
        <InfoCarousel />
      </div>
      <div className="form-panel">
        <LoginRegisterForm />
      </div>
    </div>
  );
}

export default AuthPage;
