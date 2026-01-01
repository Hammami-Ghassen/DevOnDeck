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
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [applicationError, setApplicationError] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState('');

  useEffect(() => {
    fetchOfferDetails();
  }, [id]);

  const fetchOfferDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/offers/${id}`);
      setOffer(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement de l\'offre');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    
    if (!file) {
      setCvFile(null);
      return;
    }

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      setFileError('Veuillez sélectionner un fichier PDF');
      e.target.value = '';
      setCvFile(null);
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setFileError(`Le fichier est trop volumineux (${(file.size / 1024 / 1024).toFixed(2)} MB). La taille maximale est de 5 MB.`);
      e.target.value = '';
      setCvFile(null);
      return;
    }

    setCvFile(file);
  };

  const handleApply = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user._id) {
      navigate('/login', { state: { from: `/offers/${id}` } });
      return;
    }
  
    if (user.role !== 'developer') {
      setError('Seuls les développeurs peuvent postuler aux offres');
      return;
    }

    setApplicationError('');
    setApplicationSuccess('');
    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    try {
      setApplying(true);
      setApplicationError('');
      
      let cvBase64 = "";
      let cvFilename = "";

      if (cvFile) {
        // Convert file to base64
        const reader = new FileReader();
        cvBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
          reader.readAsDataURL(cvFile);
        });
        cvFilename = cvFile.name;
      }

      await axios.post(`/offers/${id}/apply`, {
        coverLetter,
        cv: cvBase64,
        cvFilename
      });

      setApplicationSuccess('Candidature envoyée avec succès !');
      
      // Close modal and reset form after 2 seconds
      setTimeout(() => {
        setShowApplicationModal(false);
        setCoverLetter('');
        setCvFile(null);
        setFileError('');
        setApplicationSuccess('');
      }, 2000);

    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l\'envoi de la candidature';
      setApplicationError(message);
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  const handleCloseModal = () => {
    if (!applying) {
      setShowApplicationModal(false);
      setCoverLetter('');
      setCvFile(null);
      setFileError('');
      setApplicationError('');
      setApplicationSuccess('');
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
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="app-container">
        <Header />
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Erreur</h3>
          <p>{error || 'Offre non trouvée'}</p>
          <button 
            className={styles.btnPrimary}
            onClick={() => navigate('/home')}
          >
            Retour aux offres
          </button>
        </div>
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
          </div>

          {/* Main Content */}
          <div className={styles.offerContent}>
            {/* Description */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Description du poste</h2>
              <p className={styles.description}>{offer.description}</p>
            </section>

            {/* Required Skills */}
            {offer.requiredSkills && offer.requiredSkills.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Compétences requises</h2>
                <div className={styles.skillsGrid}>
                  {offer.requiredSkills.map((skill, index) => (
                    <span key={index} className={styles.skillBadge}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Required Frameworks */}
            {offer.requiredFrameworks && offer.requiredFrameworks.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Frameworks & Technologies</h2>
                <div className={styles.skillsGrid}>
                  {offer.requiredFrameworks.map((framework, index) => (
                    <span key={index} className={styles.frameworkBadge}>
                      {framework}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Offer Details */}
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

        {/* Application Modal */}
        {showApplicationModal && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Postuler à cette offre</h3>
                <button 
                  className={styles.closeBtn}
                  onClick={handleCloseModal}
                  disabled={applying}
                >
                  ×
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* Success Message */}
                {applicationSuccess && (
                  <div className={styles.successMessage}>
                    {applicationSuccess}
                  </div>
                )}

                {/* Error Message */}
                {applicationError && (
                  <div className={styles.errorMessage}>
                    {applicationError}
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="coverLetter">
                    Lettre de motivation (optionnel)
                  </label>
                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Expliquez pourquoi vous êtes le candidat idéal..."
                    rows="6"
                    className={styles.textarea}
                    disabled={applying}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="cv">
                    CV (PDF, max 5 MB - optionnel)
                  </label>
                  <input
                    type="file"
                    id="cv"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    disabled={applying}
                  />
                  {cvFile && !fileError && (
                    <p className={styles.fileName}>
                      📄 {cvFile.name} ({(cvFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                  {fileError && (
                    <p className={styles.fileError}>
                      ⚠️ {fileError}
                    </p>
                  )}
                  <p className={styles.fileHint}>
                    Format accepté : PDF uniquement, taille maximale : 5 MB
                  </p>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  className={styles.submitBtn}
                  onClick={submitApplication}
                  disabled={applying || !!fileError}
                >
                  {applying ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={handleCloseModal}
                  disabled={applying}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OfferDetails;