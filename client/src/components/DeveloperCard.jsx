import React from 'react';
import styles from '../Styles/DeveloperCard.module.css';

const DeveloperCard = ({ developer, onEdit, onDelete }) => {
  return (
    <div className={styles.developerCard}>
      <div className={styles.cardHeader}>
        {developer.avatar && (
          <img 
            src={developer.avatar} 
            alt={developer.name}
            className={styles.developerAvatar}
          />
        )}
        <div className={styles.developerInfo}>
          <h3>{developer.name}</h3>
          <p className={styles.developerEmail}>✉️ {developer.email}</p>
        </div>
      </div>

      <div className={styles.developerBio}>
        {developer.bio || 'Aucune biographie disponible'}
      </div>

      <div className={styles.skillsSection}>
        <p className={styles.sectionTitle}>💻 Compétences</p>
        <div className={styles.skillsList}>
          {developer.skills.map((skill, index) => (
            <span key={index} className={styles.skillBadge}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.frameworksSection}>
        <p className={styles.sectionTitle}>🔧 Frameworks & Librairies</p>
        <div className={styles.frameworksList}>
          {developer.frameworks.map((framework, index) => (
            <span key={index} className={styles.frameworkBadge}>
              {framework}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.cardActions}>
        <button 
          className={`${styles.btn} ${styles.btnEdit}`}
          onClick={() => onEdit(developer)}
        >
          ✏️ Modifier 
        </button>
        <button 
          className={`${styles.btn} ${styles.btnDelete}`}
          onClick={() => onDelete(developer)}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
};

export default DeveloperCard;