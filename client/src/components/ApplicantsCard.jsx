import React, { useState, useEffect } from 'react';
import styles from '../Styles/ApplicantsCard.module.css';
import axios from '../utils/axios';

const ApplicantsCard = ({ developer, offerId, application, onStatusUpdate }) => {
  const [matchingScore, setMatchingScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchMatchingScore = async () => {
      if (!offerId || !developer?._id) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`/developers/matching/${offerId}/${developer._id}`);
        setMatchingScore(response.data.matchingScore);
      } catch (error) {
        console.error('Erreur lors du calcul du matching:', error);
        setMatchingScore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingScore();
  }, [offerId, developer?._id]);

  // Couleur selon le pourcentage
  const getMatchingColor = (percent) => {
    if (percent >= 70) return styles.matchingHigh;
    if (percent >= 40) return styles.matchingMedium;
    return styles.matchingLow;
  };

  // Fonction pour mettre à jour le statut
  const handleStatusChange = async (newStatus) => {
    if (!application?._id) return;
    
    setUpdating(true);
    try {
      await axios.put(`/applications/${application._id}/status`, { status: newStatus });
      onStatusUpdate(application._id, newStatus);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdating(false);
    }
  };

  // Badge de statut
  const getStatusBadge = () => {
    if (!application?.status) return null;
    
    const statusConfig = {
      pending: { label: '⏳ En attente', className: styles.statusPending },
      accepted: { label: '✅ Accepté', className: styles.statusAccepted },
      rejected: { label: '❌ Refusé', className: styles.statusRejected },
      reviewed: { label: '👀 Examiné', className: styles.statusReviewed }
    };
    
    const config = statusConfig[application.status] || statusConfig.pending;
    return <div className={`${styles.statusBadge} ${config.className}`}>{config.label}</div>;
  };

  return (
    <div className={styles.developerCard}>
      {getStatusBadge()}
      
      {!loading && matchingScore !== null && (
        <div className={`${styles.matchingBadge} ${getMatchingColor(matchingScore)}`}>
          {matchingScore}% Match
        </div>
      )}
      
      <div className={styles.developerInfo}>
        <h3>{developer.name}</h3>
      </div>

      <div className={styles.developerBio}>
        {developer.bio || 'Aucune biographie disponible'}
      </div>

      <div className={styles.skillsSection}>
        <p className={styles.sectionTitle}>💻 Compétences</p>
        <div className={styles.skillsList}>
          {developer.skills && developer.skills.length > 0 ? (
            developer.skills.map((skill, index) => (
              <span key={index} className={styles.skillBadge}>
                {skill}
              </span>
            ))
          ) : (
            <span className={styles.noData}>Aucune compétence</span>
          )}
        </div>
      </div>

      <div className={styles.frameworksSection}>
        <p className={styles.sectionTitle}>🔧 Frameworks & Librairies</p>
        <div className={styles.frameworksList}>
          {developer.frameworks && developer.frameworks.length > 0 ? (
            developer.frameworks.map((framework, index) => (
              <span key={index} className={styles.frameworkBadge}>
                {framework}
              </span>
            ))
          ) : (
            <span className={styles.noData}>Aucun framework</span>
          )}
        </div>
      </div>

      <div className={styles.locationSection}>
        <p className={styles.sectionTitle}>📍 Localisation</p>
        <p className={styles.locationText}>
          {developer.localisation || 'Non spécifiée'}
        </p>
      </div>

      <div className={styles.contactSection}>
        <p className={styles.sectionTitle}>📞 Contact</p>
        <div className={styles.contactInfo}>
          {developer.contact?.mail && (
            <p className={styles.contactItem}>
              ✉️ {developer.contact.mail}
            </p>
          )}
          {developer.contact?.numero && (
            <p className={styles.contactItem}>
              📱 {developer.contact.numero}
            </p>
          )}
          {!developer.contact?.mail && !developer.contact?.numero && (
            <span className={styles.noData}>Aucun contact disponible</span>
          )}
        </div>
      </div>

      <div className={styles.cardActions}>
        {application?.status === 'pending' ? (
          <>
            <button 
              className={`${styles.btn} ${styles.btnAccept}`}
              onClick={() => handleStatusChange('accepted')}
              disabled={updating}
            >
              {updating ? '⏳...' : '✅ Accepter'}
            </button>
            <button 
              className={`${styles.btn} ${styles.btnReject}`}
              onClick={() => handleStatusChange('rejected')}
              disabled={updating}
            >
              {updating ? '⏳...' : '❌ Refuser'}
            </button>
          </>
        ) : (
          <div className={styles.statusMessage}>
            {application?.status === 'accepted' && '✅ Candidature acceptée'}
            {application?.status === 'rejected' && '❌ Candidature refusée'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsCard ;