import React, { useState, useEffect } from 'react';
import '../Styles/Modal.css';

const EditDeveloperModal = ({ developer, onClose, onSave }) => {
  // États pour chaque champ du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: '',
    frameworks: ''
  });

  // Remplir le formulaire avec les données existantes
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

  // Gérer les changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Transformer les chaînes de compétences en tableaux
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

  // Fermer la modale si on clique en dehors
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>✏️ Modifier le développeur</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
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

          <div className="form-group">
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

          <div className="form-group">
            <label htmlFor="bio">Biographie</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Compétences principales</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="skills-input"
              required
            />
            <span className="skills-help">
              Séparez les compétences par des virgules (ex: JavaScript, React, Node.js)
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="frameworks">Frameworks & Librairies</label>
            <input
              type="text"
              id="frameworks"
              name="frameworks"
              value={formData.frameworks}
              onChange={handleChange}
              required
            />
            <span className="frameworks-help">
              Séparez les frameworks par des virgules (ex: Express, Django)
            </span>
          </div>

          <div className="modal-footer">
            <button type="submit" className="save-btn">Enregistrer</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeveloperModal;