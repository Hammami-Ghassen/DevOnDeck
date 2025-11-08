import React, { useState, useEffect } from 'react';
import styles from '../Styles/Modal.module.css';

const EditDeveloperModal = ({ developer, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: '',
    frameworks: ''
  });

  useEffect(() => {
    if (developer) {
      setFormData({
        name: developer.name,
        email: developer.email,
        bio: developer.bio,
        skills: developer.skills.join(', '),
        frameworks: developer.frameworks.join(', ')
      });
    }
  }, [developer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedDeveloper = {
      ...developer,
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      frameworks: formData.frameworks.split(',').map(f => f.trim()).filter(f => f)
    };

    onSave(updatedDeveloper);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className.includes('modalOverlay')) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>✏️ Modifier le développeur</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nom complet</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bio">Biographie</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="skills">Compétences principales</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className={styles.skillsInput}
              required
            />
            <span className={styles.skillsHelp}>
              Séparez les compétences par des virgules (ex: JavaScript, React, Node.js)
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="frameworks">Frameworks & Librairies</label>
            <input
              type="text"
              id="frameworks"
              name="frameworks"
              value={formData.frameworks}
              onChange={handleChange}
              required
            />
            <span className={styles.skillsHelp}>
              Séparez les frameworks par des virgules (ex: Express, Django)
            </span>
          </div>

          <div className={styles.modalFooter}>
            <button type="submit" className={styles.saveBtn}>Enregistrer</button>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeveloperModal;