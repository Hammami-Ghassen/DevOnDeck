import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Styles/Auth.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log(formData.email)
    console.log(formData.password)

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      console.log('✅ Login successful:', response.data);

      // Store token and user in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // Redirect based on user role
      const { role, _id } = response.data.user;
      
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'developer') {
        navigate(`/developer/${_id}`);
      } else if (role === 'organization') {
        navigate('/organization/dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('❌ Login error:', err);
      setError(
        err.response?.data?.message || 
        'Erreur lors de la connexion. Veuillez vérifier vos identifiants.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>🔐 Connexion</h2>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className={styles.btnPrimary}
            disabled={loading}
          >
            {loading ? '⏳ Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
        
        <p className={styles.authLink}>
          Pas de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;