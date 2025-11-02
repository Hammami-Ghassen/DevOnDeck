import React from 'react';
import '../Styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {/* Logo image */}
          <img 
            src="logo1a.png" 
            alt="DevOnDeck Logo" 
            className="logo-image"
          />
          <div>
            <h1>DevOnDeck Admin</h1>
            <p className="header-subtitle">Gestion des développeurs</p>
          </div>
        </div>
        <div className="admin-badge">
          👤 Administrateur
        </div>
      </div>
    </header>
  );
};

export default Header;