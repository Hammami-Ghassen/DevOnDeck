import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Auth.css';

const Register = () => {
  const [userType, setUserType] = useState('developer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    console.log('Inscription:', { ...formData, userType });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>📝 Inscription</h2>
        
        <div className="user-type-selector">
          <button 
            type="button"
            className={userType === 'developer' ? 'active' : ''}
            onClick={() => setUserType('developer')}
          >
            👨‍💻 Développeur
          </button>
          <button 
            type="button"
            className={userType === 'organization' ? 'active' : ''}
            onClick={() => setUserType('organization')}
          >
            🏢 Organisation
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nom complet"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            S'inscrire
          </button>
        </form>
        <p className="auth-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;