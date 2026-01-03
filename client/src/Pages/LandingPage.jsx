import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styles/Landing.module.css';

const LandingPage = () => {
  return (
    <div className={styles.landing}>
      <div className={`${styles.hero} animate-content`}>
        <h1 className="animate-header">👨‍💻 DevOnDeck</h1>
        <p className="animate-content delay-200">
          La plateforme qui met en relation les meilleurs développeurs 
          avec les organisations qui ont besoin de leurs compétences
        </p>
        <div className={`${styles.ctaButtons} animate-section delay-300`}>
          <Link to="/register" className={`${styles.btn} ${styles.btnPrimary}`}>
            Commencer maintenant
          </Link>
          <Link to="/login" className={`${styles.btn} ${styles.btnSecondary}`}>
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;