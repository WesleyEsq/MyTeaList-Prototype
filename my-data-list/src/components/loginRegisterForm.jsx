import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importamos Link y useNavigate
import { signUp, signIn } from '../services/authService';
import '../styles/LoginRegisterForm.css';

function LoginRegisterForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook para la navegación

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!isLogin && !agreedToTerms) {
      setError("You must agree to the Terms and Conditions to register.");
      return;
    }
    setIsLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, username);
      }
      navigate('/'); // Redirige al perfil después de un login/registro exitoso
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Email o contraseña incorrectos.');
          break;
        case 'auth/invalid-email':
          setError('El formato del email no es válido.');
          break;
        case 'auth/email-already-in-use':
          setError('Este email ya está registrado.');
          break;
        case 'auth/weak-password':
          setError('La contraseña debe tener al menos 6 caracteres.');
          break;
        default:
          setError('Ocurrió un error. Inténtalo de nuevo.');
          console.error("Auth Error:", err);
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isRegisterButtonDisabled = !isLogin && (!agreedToTerms || isLoading);

  return (
    <div className="form-container">
      <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your_username" required />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        {!isLogin && (
          <div className="terms-agreement">
            <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
            <label htmlFor="terms">
              I agree to the{' '}
              {/* Usamos el componente Link para la navegación */}
              <Link to="/terms" className="link">
                Terms and Conditions
              </Link>
            </label>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-btn" disabled={isLogin ? isLoading : isRegisterButtonDisabled}>
          {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
      </form>
      <div className="toggle-form">
        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); }} className="toggle-btn">
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
}

export default LoginRegisterForm;

