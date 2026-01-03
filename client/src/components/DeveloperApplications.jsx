import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import styles from '../Styles/DeveloperApplications.module.css';

const DeveloperApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const developerId = JSON.parse(localStorage.getItem('user'))._id;

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`/applications/my-applications/${developerId}`);
      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.message || 'Failed to fetch applications');
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      reviewed: 'Examinée',
      accepted: 'Acceptée',
      rejected: 'Refusée'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Chargement des candidatures...</p>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (applications.length === 0) {
    return (
      <div className={`${styles.emptyState} animate-content`}>
        <p>📭 Vous n'avez pas encore postulé à des offres</p>
      </div>
    );
  }

  return (
    <div className={styles.applicationsContainer}>
      <div className={styles.applicationsList}>
        {applications.map((application, index) => (
          <div 
            key={application._id} 
            className={`${styles.applicationCard} stagger-item`}
            style={{ animationDelay: `${0.1 * (index % 6)}s` }}
          >
            <div className={styles.applicationHeader}>
              <h3 className={styles.applicationTitle}>
                {application.offerId?.title || 'Offre supprimée'}
              </h3>
              <span className={`${styles.status} ${styles[application.status]}`}>
                {getStatusLabel(application.status)}
              </span>
            </div>

            <p className={styles.company}>
              🏢 {application.offerId?.organizationId?.name || 'Organisation inconnue'}
            </p>

            <p className={styles.date}>
              📅 Postulé le {new Date(application.createdAt).toLocaleDateString('fr-FR')}
            </p>

            {application.coverLetter && (
              <p className={styles.coverLetter}>
                💬 {application.coverLetter.substring(0, 100)}
                {application.coverLetter.length > 100 && '...'}
              </p>
            )}

            {application.cvFilename && (
              <p className={styles.cvInfo}>
                📄 CV: {application.cvFilename}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperApplications;