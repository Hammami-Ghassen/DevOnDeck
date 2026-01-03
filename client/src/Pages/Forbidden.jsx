import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Styles/Error.module.css';

const Forbidden = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const goToMyDashboard = () => {
    if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user.role === 'developer') {
      navigate(`/developer/${user._id}`);
    } else if (user.role === 'organization') {
      navigate('/organization/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.errorContainer}>
      <div className={`${styles.errorCard} animate-card`}>
        <div className={`${styles.errorIcon} animate-header`}>🚫</div>
        <h1 className={`${styles.errorTitle} animate-content delay-100`}>403</h1>
        <h2 className={`${styles.errorSubtitle} animate-content delay-200`}>Accès refusé</h2>
        <p className={`${styles.errorMessage} animate-content delay-300`}>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <div className={`${styles.errorActions} animate-section delay-400`}>
          <button onClick={goToMyDashboard} className={styles.btnPrimary}>
            Mon Dashboard
          </button>
          <Link to="/home" className={styles.btnSecondary}>
            Page d'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;