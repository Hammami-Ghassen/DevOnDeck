import React, { useState } from 'react';
import styles from '../Styles/ProfileInfo.module.css';

const ProfileInfo = ({ developer, isEditing, canEdit, saving, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: developer?.name || '',
    email: developer?.email || '',
    title: developer?.title || '',
    bio: developer?.bio || '',
    skills: developer?.skills || [],
    experience: developer?.experience || '',
    location: developer?.location || '',
    github: developer?.github || '',
    linkedin: developer?.linkedin || '',
    portfolio: developer?.portfolio || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className={styles.editForm}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Nom complet</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Titre professionnel</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Localisation</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
            <label>Biographie</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className={styles.formGroup}>
            <label>GitHub</label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Portfolio</label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Annuler
          </button>
          <button type="submit" disabled={saving} className={styles.saveButton}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className={styles.profileInfoView}>
      <div className={styles.infoSection}>
        <h2>Informations personnelles</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{developer?.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Localisation</span>
            <span className={styles.value}>{developer?.location || 'Non spécifié'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Expérience</span>
            <span className={styles.value}>{developer?.experience || 'Non spécifié'}</span>
          </div>
        </div>
      </div>

      {developer?.bio && (
        <div className={styles.infoSection}>
          <h2>Biographie</h2>
          <p className={styles.bio}>{developer.bio}</p>
        </div>
      )}

      {developer?.skills && developer.skills.length > 0 && (
        <div className={styles.infoSection}>
          <h2>Compétences</h2>
          <div className={styles.skillsContainer}>
            {developer.skills.map((skill, index) => (
              <span key={index} className={styles.skillBadge}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.infoSection}>
        <h2>Liens</h2>
        <div className={styles.linksContainer}>
          {developer?.github && (
            <a href={developer.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
              🔗 GitHub
            </a>
          )}
          {developer?.linkedin && (
            <a href={developer.linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
              🔗 LinkedIn
            </a>
          )}
          {developer?.portfolio && (
            <a href={developer.portfolio} target="_blank" rel="noopener noreferrer" className={styles.link}>
              🔗 Portfolio
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;