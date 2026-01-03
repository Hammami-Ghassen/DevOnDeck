import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Styles/Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoggedIn = !!currentUser;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileClick = () => {
    if (currentUser.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (currentUser.role === 'developer') {
      navigate(`/developer/${currentUser._id}`);
    } else if (currentUser.role === 'organization') {
      navigate('/organization/dashboard');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/home" className={styles.logo}>
          👨‍💻 DevOnDeck
        </Link>

        <nav className={styles.nav}>
          <ul className={styles.navLinks}>
            <li>
              <Link to="/home" className={styles.navLink}>
                Offres
              </Link>
            </li>
            {isLoggedIn && currentUser.role === 'organization' && (
              <li>
                <Link to="/organization/dashboard" className={styles.navLink}>
                  Dashboard
                </Link>
              </li>
            )}
            {isLoggedIn && currentUser.role === 'admin' && (
              <li>
                <Link to="/admin/dashboard" className={styles.navLink}>
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className={styles.authButtons}>
            {isLoggedIn ? (
              <>
                <button onClick={handleProfileClick} className={styles.btnLogin}>
                  {currentUser.role === 'developer' ? '👨‍💻' : 
                   currentUser.role === 'organization' ? '🏢' : '⚙️'} {currentUser.name}
                </button>
                <button onClick={handleLogout} className={styles.btnRegister}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.btnLogin}>
                  Se connecter
                </Link>
                <Link to="/register" className={styles.btnRegister}>
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </nav>

        <button 
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className={`${styles.mobileMenu} ${styles.active}`}>
          <ul className={styles.mobileNavLinks}>
            <li>
              <Link to="/home" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                Offres
              </Link>
            </li>
            {isLoggedIn && currentUser.role === 'organization' && (
              <li>
                <Link to="/organization/dashboard" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>
            )}
            {isLoggedIn && currentUser.role === 'admin' && (
              <li>
                <Link to="/admin/dashboard" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className={styles.mobileAuthButtons}>
            {isLoggedIn ? (
              <>
                <button onClick={() => { handleProfileClick(); setMobileMenuOpen(false); }} className={styles.btnLogin}>
                  Mon Profil
                </button>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className={styles.btnRegister}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.btnLogin} onClick={() => setMobileMenuOpen(false)}>
                  Se connecter
                </Link>
                <Link to="/register" className={styles.btnRegister} onClick={() => setMobileMenuOpen(false)}>
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;