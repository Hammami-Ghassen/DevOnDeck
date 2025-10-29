import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { apiService } from '../../services/api.js';

const DeveloperProfile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState({
    bio: '',
    mainSkills: [],
    additionalSkills: [],
    experience: '',
    location: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [newAdditionalSkill, setNewAdditionalSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addMainSkill = () => {
    if (newSkill && profile.mainSkills.length < 5) {
      setProfile({
        ...profile,
        mainSkills: [...profile.mainSkills, newSkill]
      });
      setNewSkill('');
    }
  };

  const addAdditionalSkill = () => {
    if (newAdditionalSkill) {
      setProfile({
        ...profile,
        additionalSkills: [...profile.additionalSkills, newAdditionalSkill]
      });
      setNewAdditionalSkill('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await apiService.updateDeveloperProfile(profile, token);
    
    if (result.success) {
      setMessage('✅ Profil mis à jour avec succès!');
    } else {
      setMessage('❌ Erreur lors de la mise à jour');
    }
    
    setLoading(false);
  };

  return (
    <div className="developer-profile">
      <h3>👨‍💻 Profil Développeur</h3>
      
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
          <label>📝 Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            placeholder="Décrivez votre parcours, vos passions, vos ambitions..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>⭐ Compétences principales (max 5)</label>
          <div className="skills-input">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Ex: JavaScript, React, Node.js..."
              disabled={profile.mainSkills.length >= 5}
            />
            <button 
              type="button" 
              onClick={addMainSkill}
              disabled={profile.mainSkills.length >= 5 || !newSkill}
            >
              +
            </button>
          </div>
          <div className="skills-list">
            {profile.mainSkills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                <button 
                  type="button"
                  onClick={() => setProfile({
                    ...profile,
                    mainSkills: profile.mainSkills.filter((_, i) => i !== index)
                  })}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {profile.mainSkills.length >= 5 && (
            <small style={{ color: '#e74c3c' }}>
              Maximum 5 compétences principales atteint
            </small>
          )}
        </div>

        <div className="form-group">
          <label>🔧 Compétences supplémentaires</label>
          <div className="skills-input">
            <input
              type="text"
              value={newAdditionalSkill}
              onChange={(e) => setNewAdditionalSkill(e.target.value)}
              placeholder="Ex: MongoDB, Docker, AWS..."
            />
            <button 
              type="button" 
              onClick={addAdditionalSkill}
              disabled={!newAdditionalSkill}
            >
              +
            </button>
          </div>
          <div className="skills-list">
            {profile.additionalSkills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                <button 
                  type="button"
                  onClick={() => setProfile({
                    ...profile,
                    additionalSkills: profile.additionalSkills.filter((_, i) => i !== index)
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
            value={profile.location}
            onChange={(e) => setProfile({...profile, location: e.target.value})}
            placeholder="Ville, Pays..."
          />
        </div>

        <button type="submit" disabled={loading} className="save-btn">
          {loading ? 'Enregistrement...' : '💾 Enregistrer le profil'}
        </button>
      </form>
    </div>
  );
};

export default DeveloperProfile;