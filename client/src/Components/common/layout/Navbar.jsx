import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">🚀 DevOnDeck</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <span>👋 Bonjour, {user.name}</span>
            <Link to={user.userType === 'developer' ? '/developer/dashboard' : '/organization/dashboard'}>
              📊 Dashboard
            </Link>
            {user.userType === 'developer' ? (
              <Link to="/jobs">💼 Offres</Link>
            ) : (
              <Link to="/developers">👨‍💻 Développeurs</Link>
            )}
            <button onClick={handleLogout}>🚪 Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login">🔐 Connexion</Link>
            <Link to="/register">📝 Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;