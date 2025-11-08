import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Styles/Auth.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('developer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType
      });

      console.log('✅ Registration successful:', response.data);

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // Redirect based on role
      if (userType === 'developer') {
        navigate(`/developer/${response.data.user._id}`);
      } else if (userType === 'organization') {
        navigate('/organization/dashboard');
      } else {
        navigate('/admin/dashboard');
      }

    } catch (err) {
      console.error('❌ Registration error:', err);
      setError(
        err.response?.data?.message || 
        'Erreur lors de l\'inscription. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>📝 Inscription</h2>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.userTypeSelector}>
          <button 
            type="button"
            className={`${styles.userTypeButton} ${userType === 'developer' ? styles.active : ''}`}
            onClick={() => setUserType('developer')}
            disabled={loading}
          >
            👨‍💻 Développeur
          </button>
          <button 
            type="button"
            className={`${styles.userTypeButton} ${userType === 'organization' ? styles.active : ''}`}
            onClick={() => setUserType('organization')}
            disabled={loading}
          >
            🏢 Organisation
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Nom complet"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Mot de passe (min. 6 caractères)"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className={styles.btnPrimary}
            disabled={loading}
          >
            {loading ? '⏳ Inscription en cours...' : 'S\'inscrire'}
          </button>
        </form>
        
        <p className={styles.authLink}>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;