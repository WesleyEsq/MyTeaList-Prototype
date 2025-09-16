import React, { useState, useEffect, useMemo } from 'react';
import { getAvailableThemes, updateUserThemePreference } from '../services/themeService';
import '../styles/ThemeSelectorModal.css';

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;

function ThemeSelectorModal({ user, currentTheme, onThemeChange, onClose }) {
  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('dark');

  useEffect(() => {
    const fetchThemes = async () => {
      const availableThemes = await getAvailableThemes();
      setThemes(availableThemes);
      setIsLoading(false);
    };
    fetchThemes();
  }, []);

  const filteredThemes = useMemo(() => {
    return themes.filter(theme => theme.type === selectedType);
  }, [themes, selectedType]);

  const handleSelectTheme = (themeId) => {
    onThemeChange(themeId);
    updateUserThemePreference(user.uid, themeId);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content theme-modal" onClick={(e) => e.stopPropagation()}>
        <div className="theme-modal-header">
          <h2>Choose a Theme</h2>
          <div className="theme-switch-container">
            <input 
              type="checkbox" 
              id="theme-switch-checkbox"
              checked={selectedType === 'light'}
              onChange={() => setSelectedType(selectedType === 'dark' ? 'light' : 'dark')}
            />
            <label htmlFor="theme-switch-checkbox" className="theme-switch">
              <div className="switch-handle">
                {selectedType === 'dark' ? <MoonIcon /> : <SunIcon />}
              </div>
            </label>
          </div>
        </div>

        {isLoading ? (
          <p>Loading themes...</p>
        ) : (
          <div className="themes-grid">
            {filteredThemes.map((theme) => (
              <div key={theme.id} className="theme-card" onClick={() => handleSelectTheme(theme.id)}>
                <div className="theme-preview">
                  <div style={{ backgroundColor: theme.colors['--background-color'] }} className="color-swatch"></div>
                  <div style={{ backgroundColor: theme.colors['--surface-color'] }} className="color-swatch"></div>
                  <div style={{ backgroundColor: theme.colors['--primary-color'] }} className="color-swatch"></div>
                  <div style={{ backgroundColor: theme.colors['--accent-color'] }} className="color-swatch"></div>
                </div>
                <div className="theme-name">
                  <span>{theme.name}</span>
                  {currentTheme === theme.id && <CheckIcon />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThemeSelectorModal;

