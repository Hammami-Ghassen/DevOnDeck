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
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
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

    try {
      await onSave(updatedDeveloper);
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !saving) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>✏️ Modifier le profil</h2>
          <button 
            className={styles.closeBtn} 
            onClick={onClose}
            disabled={saving}
            type="button"
          >
            ×
          </button>
        </div>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Personal Information Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>👤 Informations personnelles</h3>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Nom complet *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={saving}
                    placeholder="Jean Dupont"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email principal *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={saving}
                    placeholder="jean.dupont@email.com"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="localisation">Localisation</label>
                <input
                  type="text"
                  id="localisation"
                  name="localisation"
                  value={formData.localisation}
                  onChange={handleChange}
                  disabled={saving}
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
                  disabled={saving}
                  placeholder="Parlez-nous de vous..."
                  rows="4"
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>📞 Informations de contact</h3>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="contactMail">Email de contact</label>
                  <input
                    type="email"
                    id="contactMail"
                    name="contactMail"
                    value={formData.contactMail}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="contact@email.com"
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
                    disabled={saving}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>💻 Compétences</h3>
              
              <div className={styles.tagInputWrapper}>
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'skill')}
                  placeholder="Ex: JavaScript, Python, React..."
                  className={styles.tagInput}
                  disabled={saving}
                />
                <button 
                  type="button" 
                  onClick={addSkill}
                  className={styles.addBtn}
                  disabled={!currentSkill.trim() || saving}
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
                      disabled={saving}
                      aria-label={`Supprimer ${skill}`}
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

            {/* Frameworks Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>🔧 Frameworks & Technologies</h3>
              
              <div className={styles.tagInputWrapper}>
                <input
                  type="text"
                  value={currentFramework}
                  onChange={(e) => setCurrentFramework(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'framework')}
                  placeholder="Ex: Express, Django, Docker..."
                  className={styles.tagInput}
                  disabled={saving}
                />
                <button 
                  type="button" 
                  onClick={addFramework}
                  className={styles.addBtn}
                  disabled={!currentFramework.trim() || saving}
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
                      disabled={saving}
                      aria-label={`Supprimer ${framework}`}
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
          </div>

          <div className={styles.modalFooter}>
            <button 
              type="submit" 
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? '💾 Enregistrement...' : '💾 Enregistrer'}
            </button>
            <button 
              type="button" 
              className={styles.cancelBtn} 
              onClick={onClose}
              disabled={saving}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeveloperModal;