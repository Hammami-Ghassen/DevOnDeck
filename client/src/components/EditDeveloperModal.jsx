import React, { useState, useEffect } from 'react';
import styles from '../Styles/Modal.module.css';

const EditDeveloperModal = ({ developer, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactMail: '',
    phoneNumber: '',
    localisation: '',
    bio: '',
    skills: [],
    frameworks: []
  });
  
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentFramework, setCurrentFramework] = useState('');

  useEffect(() => {
    if (developer) {
      setFormData({
        name: developer.name || '',
        email: developer.email || '',
        contactMail: developer.contact?.mail || '',
        phoneNumber: developer.contact?.numero || '',
        localisation: developer.localisation || '',
        bio: developer.bio || '',
        skills: developer.skills || [],
        frameworks: developer.frameworks || []
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

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addFramework = () => {
    if (currentFramework.trim() && !formData.frameworks.includes(currentFramework.trim())) {
      setFormData(prev => ({
        ...prev,
        frameworks: [...prev.frameworks, currentFramework.trim()]
      }));
      setCurrentFramework('');
    }
  };

  const removeFramework = (frameworkToRemove) => {
    setFormData(prev => ({
      ...prev,
      frameworks: prev.frameworks.filter(framework => framework !== frameworkToRemove)
    }));
  };

  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'skill') {
        addSkill();
      } else if (type === 'framework') {
        addFramework();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedDeveloper = {
      ...developer,
      name: formData.name,
      email: formData.email,
      contact: {
        mail: formData.contactMail,
        numero: formData.phoneNumber
      },
      localisation: formData.localisation,
      bio: formData.bio,
      skills: formData.skills,
      frameworks: formData.frameworks
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
          <h2>✏️ Modifier le profil</h2>
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
            <label htmlFor="email">Email principal</label>
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
            <label htmlFor="contactMail">Email de contact</label>
            <input
              type="email"
              id="contactMail"
              name="contactMail"
              value={formData.contactMail}
              onChange={handleChange}
              placeholder="email.contact@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber">Téléphone</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+216 22 122 222"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="localisation">Localisation</label>
            <input
              type="text"
              id="localisation"
              name="localisation"
              value={formData.localisation}
              onChange={handleChange}
              placeholder="Paris, France"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bio">Biographie</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className={styles.formGroup}>
            <label>💻 Compétences principales</label>
            <div className={styles.tagInputWrapper}>
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'skill')}
                placeholder="Ex: JavaScript, React, Node.js..."
                className={styles.tagInput}
              />
              <button 
                type="button" 
                onClick={addSkill}
                className={styles.addBtn}
                disabled={!currentSkill.trim()}
              >
                + Ajouter
              </button>
            </div>
            <div className={styles.tagsContainer}>
              {formData.skills.map((skill, index) => (
                <span key={index} className={styles.tag}>
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    className={styles.removeTagBtn}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {formData.skills.length === 0 && (
              <span className={styles.emptyHint}>Aucune compétence ajoutée</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>🔧 Frameworks & Librairies</label>
            <div className={styles.tagInputWrapper}>
              <input
                type="text"
                value={currentFramework}
                onChange={(e) => setCurrentFramework(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'framework')}
                placeholder="Ex: Express, Django, Docker..."
                className={styles.tagInput}
              />
              <button 
                type="button" 
                onClick={addFramework}
                className={styles.addBtn}
                disabled={!currentFramework.trim()}
              >
                + Ajouter
              </button>
            </div>
            <div className={styles.tagsContainer}>
              {formData.frameworks.map((framework, index) => (
                <span key={index} className={`${styles.tag} ${styles.frameworkTag}`}>
                  {framework}
                  <button 
                    type="button" 
                    onClick={() => removeFramework(framework)}
                    className={styles.removeTagBtn}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {formData.frameworks.length === 0 && (
              <span className={styles.emptyHint}>Aucun framework ajouté</span>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button type="submit" className={styles.saveBtn}>
              💾 Enregistrer
            </button>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeveloperModal;