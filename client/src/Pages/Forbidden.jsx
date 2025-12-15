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
      <div className={styles.errorCard}>
        <div className={styles.errorIcon}>🚫</div>
        <h1 className={styles.errorTitle}>403</h1>
        <h2 className={styles.errorSubtitle}>Accès refusé</h2>
        <p className={styles.errorMessage}>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <div className={styles.errorActions}>
          <button onClick={goToMyDashboard} className={styles.btnPrimary}>
            Retour à mon tableau de bord
          </button>
          <Link to="/" className={styles.btnSecondary}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;