import React from 'react';
import '../styles/Header.css'; 

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-container">

        {/* --- Iconos en el header --- */}
          <svg 
            className="logo-icon tea-cup-icon"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
          </svg>
          <h1>TeaLists</h1>
        </div>
      </div>
    </header>
  );
}

export default Header;