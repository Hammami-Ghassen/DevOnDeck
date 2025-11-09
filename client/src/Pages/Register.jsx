import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import styles from '../Styles/Auth.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('developer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: ''
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Nom requis';
      isValid = false;
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation requise';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: ''
    });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType
      });

      console.log('✅ Registration successful:', response.data);

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (userType === 'developer') {
        navigate(`/developer/${response.data.user._id}`);
      } else if (userType === 'organization') {
        navigate('/organization/dashboard');
      } else {
        navigate('/admin/dashboard');
      }

    } catch (err) {
      console.error('❌ Registration error:', err);
      setErrors({
        ...errors,
        general: err.response?.data?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>📝 Inscription</h2>
        
        {errors.general && (
          <div className={styles.errorMessage}>
            {errors.general}
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
            <label className={errors.name ? styles.errorLabel : ''}>
              Nom complet
            </label>
            {errors.name && (
              <span className={styles.fieldError}>{errors.name}</span>
            )}
            <input
              type="text"
              placeholder="Nom complet"
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                setErrors({...errors, name: ''});
              }}
              className={errors.name ? styles.errorInput : ''}
              disabled={loading}
            />
          </div>

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
              placeholder="Mot de passe (min. 6 caractères)"
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                setErrors({...errors, password: ''});
              }}
              className={errors.password ? styles.errorInput : ''}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={errors.confirmPassword ? styles.errorLabel : ''}>
              Confirmer le mot de passe
            </label>
            {errors.confirmPassword && (
              <span className={styles.fieldError}>{errors.confirmPassword}</span>
            )}
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({...formData, confirmPassword: e.target.value});
                setErrors({...errors, confirmPassword: ''});
              }}
              className={errors.confirmPassword ? styles.errorInput : ''}
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