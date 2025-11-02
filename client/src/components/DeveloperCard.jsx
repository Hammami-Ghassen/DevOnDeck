import React from 'react';
import '../Styles/DeveloperCard.css';

const DeveloperCard = ({ developer, onEdit, onDelete }) => {
  return (
    <div className="developer-card">
      <div className="card-header">
        <img 
          src={developer.avatar} 
          alt={developer.name}
          className="developer-avatar"
        />
        <div className="developer-info">
          <h3>{developer.name}</h3>
          <p className="developer-email">
            ✉️ {developer.email}
          </p>
        </div>
      </div>

      <div className="developer-bio">
        {developer.bio}
      </div>

      <div className="skills-section">
        <p className="section-title">💻 Compétences principales</p>
        <div className="skills-list">
          {developer.skills.map((skill, index) => (
            <span key={index} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="frameworks-section">
        <p className="section-title">🔧 Frameworks & Librairies</p>
        <div className="frameworks-list">
          {developer.frameworks.map((framework, index) => (
            <span key={index} className="framework-badge">
              {framework}
            </span>
          ))}
        </div>
      </div>

      <div className="card-actions">
        <button 
          className="btn btn-edit"
          onClick={() => onEdit(developer)}
        >
          ✏️ Modifier 
        </button>
        <button 
          className="btn btn-delete"
          onClick={() => onDelete(developer)}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
};

export default DeveloperCard;