import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { apiService } from '../../services/api.js';

const JobCreation = () => {
  const { token } = useAuth();
  const [job, setJob] = useState({
    title: '',
    description: '',
    requiredSkills: [],
    location: '',
    salary: '',
    jobType: 'full-time'
  });

  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addRequiredSkill = () => {
    if (newSkill) {
      setJob({
        ...job,
        requiredSkills: [...job.requiredSkills, newSkill]
      });
      setNewSkill('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await apiService.createJob(job, token);
    
    if (result.success) {
      setMessage('✅ Offre créée avec succès!');
      // Réinitialiser le formulaire
      setJob({
        title: '',
        description: '',
        requiredSkills: [],
        location: '',
        salary: '',
        jobType: 'full-time'
      });
    } else {
      setMessage('❌ Erreur lors de la création de l\'offre');
    }
    
    setLoading(false);
  };

  return (
    <div className="job-creation">
      <h3>📝 Créer une offre d'emploi</h3>
      
      {message && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1rem', 
          borderRadius: '4px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>🏷️ Titre du poste</label>
          <input
            type="text"
            placeholder="Ex: Développeur Full Stack React/Node.js"
            value={job.title}
            onChange={(e) => setJob({...job, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>📄 Description du poste</label>
          <textarea
            placeholder="Décrivez les missions, responsabilités, environnement de travail..."
            value={job.description}
            onChange={(e) => setJob({...job, description: e.target.value})}
            rows="6"
            required
          />
        </div>

        <div className="form-group">
          <label>⭐ Compétences requises</label>
          <div className="skills-input">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Ex: JavaScript, React, MongoDB..."
            />
            <button type="button" onClick={addRequiredSkill} disabled={!newSkill}>
              +
            </button>
          </div>
          <div className="skills-list">
            {job.requiredSkills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                <button 
                  type="button"
                  onClick={() => setJob({
                    ...job,
                    requiredSkills: job.requiredSkills.filter((_, i) => i !== index)
                  })}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>📍 Localisation</label>
          <input
            type="text"
            placeholder="Ex: Paris, Remote, Hybride..."
            value={job.location}
            onChange={(e) => setJob({...job, location: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>💰 Salaire</label>
          <input
            type="text"
            placeholder="Ex: 45K-55K€, Selon profil..."
            value={job.salary}
            onChange={(e) => setJob({...job, salary: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>⏱️ Type de contrat</label>
          <select 
            value={job.jobType} 
            onChange={(e) => setJob({...job, jobType: e.target.value})}
          >
            <option value="full-time">Temps plein</option>
            <option value="part-time">Temps partiel</option>
            <option value="contract">Contrat</option>
            <option value="internship">Stage</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Publication...' : '🚀 Publier l\'offre'}
        </button>
      </form>
    </div>
  );
};

export default JobCreation;