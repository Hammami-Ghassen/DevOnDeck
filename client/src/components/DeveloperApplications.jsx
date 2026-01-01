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

  if (loading) return <div className={styles.loading}>Loading applications...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.applicationsContainer}>
      <h2>Mes Candidatures</h2>
      
      {applications.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Vous n'avez postulé à aucune offre pour le moment.</p>
        </div>
      ) : (
        <div className={styles.applicationsList}>
          {applications.map((app) => (
            <div key={app._id} className={styles.applicationCard}>
              <div className={styles.applicationHeader}>
                <h3>{app.offerId.title}</h3>
                <span className={`${styles.status} ${styles[app.status]}`}>
                  {app.status === 'pending' ? 'En attente' : 
                   app.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                </span>
              </div>
              
              <p className={styles.company}>
                <strong>Organisation:</strong> {app.offerId.organizationId.name}
              </p>
              <p className={styles.date}>
                Postulé le: {new Date(app.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeveloperApplications;