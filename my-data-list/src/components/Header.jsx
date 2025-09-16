import React from 'react';
// Importamos los estilos desde la nueva carpeta 'styles'
import '../styles/Header.css'; 

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-container">
          {/* Ícono SVG para darle un toque especial */}
          <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 .5.04.5.12V13z"/>
          </svg>
          <h1>MyTeaData</h1>
        </div>
      </div>
    </header>
  );
}

export default Header;
