import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Header from '../components/Header';
import styles from '../Styles/offerDetails.module.css';

const OfferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchOfferDetails();
  }, [id]);

  const fetchOfferDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/offers/${id}`);
      setOffer(response.data);
    } catch (err) {
      setError('Erreur lors du chargement de l\'offre');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Current user:', user);
    
    if (!user._id) {
      navigate('/login', { state: { from: `/offers/${id}` } });
      return;
    }
  
    if (user.role !== 'developer') {
      alert('Seuls les développeurs peuvent postuler aux offres');
      return;
    }
  
    try {
      setApplying(true);
      await axios.post(`/offers/${id}/apply`);
      alert('✓ Candidature envoyée avec succès !');
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l\'envoi de la candidature';
      alert(`✗ ${message}`);
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  const getContractTypeLabel = (type) => {
    const labels = {
      'CDI': 'CDI',
      'CDD': 'CDD',
      'freelance': 'Freelance',
      'stage': 'Stage'
    };
    return labels[type] || type;
  };

  const getExperienceLevelLabel = (level) => {
    const labels = {
      'junior': 'Junior',
      'intermediate': 'Intermédiaire',
      'senior': 'Senior',
      'expert': 'Expert'
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className={styles.loading}>Chargement...</div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="app-container">
        <Header />
        <div className={styles.error}>{error || 'Offre non trouvée'}</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      
      <main className={styles.offerDetails}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Retour
        </button>

        <div className={styles.offerContainer}>
          {/* Header Section */}
          <div className={styles.offerHeader}>
            <div className={styles.headerContent}>
              <h1 className={styles.offerTitle}>{offer.title}</h1>
              <div className={styles.offerMeta}>
                <span className={styles.company}>
                  🏢 {offer.organizationId?.name || 'Organisation'}
                </span>
                <span className={styles.location}>
                  📍 {offer.preferredLocalisation || 'Non spécifié'}
                </span>
                <span className={`${styles.contractBadge} ${styles[offer.contractType]}`}>
                  {getContractTypeLabel(offer.contractType)}
                </span>
              </div>
            </div>
            <button 
              className={styles.applyButton}
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? 'Envoi en cours...' : '📧 Postuler'}
            </button>
          </div>

          {/* Main Content */}
          <div className={styles.offerContent}>
            {/* Description */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Description du poste</h2>
              <p className={styles.description}>{offer.description}</p>
            </section>

            {/* Required Skills */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Compétences requises</h2>
              <div className={styles.skillsGrid}>
                {offer.requiredSkills.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Frameworks */}
            {offer.requiredFrameworks && offer.requiredFrameworks.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Frameworks</h2>
                <div className={styles.skillsGrid}>
                  {offer.requiredFrameworks.map((framework, index) => (
                    <span key={index} className={styles.frameworkTag}>
                      {framework}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Details Grid */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Détails de l'offre</h2>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>💼 Niveau d'expérience</span>
                  <span className={styles.detailValue}>
                    {getExperienceLevelLabel(offer.experienceLevel)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>📝 Type de contrat</span>
                  <span className={styles.detailValue}>
                    {getContractTypeLabel(offer.contractType)}
                  </span>
                </div>
                {offer.salary && offer.salary.min && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>💰 Salaire</span>
                    <span className={styles.detailValue}>
                      {offer.salary.min} - {offer.salary.max} TND
                    </span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>📅 Publié le</span>
                  <span className={styles.detailValue}>
                    {new Date(offer.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Action */}
          <div className={styles.offerFooter}>
            <button 
              className={styles.applyButtonLarge}
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? 'Envoi en cours...' : '📧 Postuler à cette offre'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfferDetails;