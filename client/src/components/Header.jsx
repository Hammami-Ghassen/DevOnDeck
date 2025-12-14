import React from 'react';
import styles from '../Styles/Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            👨‍💻
          </div>
          <div>
            <h1>DevOnDeck</h1>
            <p className={styles.headerSubtitle}>Plateforme de gestion des développeurs</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;