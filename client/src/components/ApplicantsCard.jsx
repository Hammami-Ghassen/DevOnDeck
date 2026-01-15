import React from 'react';
import styles from '../Styles/ApplicantsCard.module.css';

const ApplicantsCard = ({ developer }) => {
  return (
    <div className={styles.developerCard}>
      <div className={styles.developerInfo}>
        <h3>{developer.name}</h3>
      </div>

      <div className={styles.developerBio}>
        {developer.bio || 'Aucune biographie disponible'}
      </div>

      <div className={styles.skillsSection}>
        <p className={styles.sectionTitle}>💻 Compétences</p>
        <div className={styles.skillsList}>
          {developer.skills && developer.skills.length > 0 ? (
            developer.skills.map((skill, index) => (
              <span key={index} className={styles.skillBadge}>
                {skill}
              </span>
            ))
          ) : (
            <span className={styles.noData}>Aucune compétence</span>
          )}
        </div>
      </div>

      <div className={styles.frameworksSection}>
        <p className={styles.sectionTitle}>🔧 Frameworks & Librairies</p>
        <div className={styles.frameworksList}>
          {developer.frameworks && developer.frameworks.length > 0 ? (
            developer.frameworks.map((framework, index) => (
              <span key={index} className={styles.frameworkBadge}>
                {framework}
              </span>
            ))
          ) : (
            <span className={styles.noData}>Aucun framework</span>
          )}
        </div>
      </div>

      <div className={styles.locationSection}>
        <p className={styles.sectionTitle}>📍 Localisation</p>
        <p className={styles.locationText}>
          {developer.localisation || 'Non spécifiée'}
        </p>
      </div>

      <div className={styles.contactSection}>
        <p className={styles.sectionTitle}>📞 Contact</p>
        <div className={styles.contactInfo}>
          {developer.contact?.mail && (
            <p className={styles.contactItem}>
              ✉️ {developer.contact.mail}
            </p>
          )}
          {developer.contact?.numero && (
            <p className={styles.contactItem}>
              📱 {developer.contact.numero}
            </p>
          )}
          {!developer.contact?.mail && !developer.contact?.numero && (
            <span className={styles.noData}>Aucun contact disponible</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsCard ;