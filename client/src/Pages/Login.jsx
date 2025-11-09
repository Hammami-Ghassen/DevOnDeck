import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';  // ✅ Now safe to use!
import styles from '../Styles/Auth.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = { email: '', password: '', general: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email requis';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', general: '' });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('✅ Login successful:', response.data);

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

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
      setErrors({
        ...errors,
        general: err.response?.data?.message || 'Erreur lors de la connexion. Veuillez vérifier vos identifiants.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>🔐 Connexion</h2>
        
        {errors.general && (
          <div className={styles.errorMessage}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={errors.email ? styles.errorLabel : ''}>
              Email
            </label>
            {errors.email && (
              <span className={styles.fieldError}>{errors.email}</span>
            )}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                setErrors({...errors, email: ''});
              }}
              className={errors.email ? styles.errorInput : ''}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={errors.password ? styles.errorLabel : ''}>
              Mot de passe
            </label>
            {errors.password && (
              <span className={styles.fieldError}>{errors.password}</span>
            )}
            <input
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                setErrors({...errors, password: ''});
              }}
              className={errors.password ? styles.errorInput : ''}
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