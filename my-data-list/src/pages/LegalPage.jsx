import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import '../styles/LegalPage.css';

// Pagina para mostrar terminos legales o politicas de privacidad.
// Solo para aclarar, esto es un prototipo, no esta revisado legalmente.
// Por favor, se debe consultar con un profesional para textos legales reales.
// Por favor no me den demandas por esto :)

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

function LegalPage({ title, content }) {
  const navigate = useNavigate(); // Hook para la navegación

  return (
    <div className="legal-page-container">
      <div className="legal-content">
        {/* El botón ahora navega a la página anterior (-1) */}
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeftIcon />
          <span>Go back</span>
        </button>
        <h1>{title}</h1>
        <div className="legal-text" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export default LegalPage;

