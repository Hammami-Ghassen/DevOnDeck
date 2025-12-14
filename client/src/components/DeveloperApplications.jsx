import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import styles from '../Styles/DeveloperApplications.module.css';
import { Console } from 'console';

const DeveloperApplications = ({ developerId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/applications/my-applications');
        
        // Update the mapping and store in state
        const mappedApplications = response.data.map(app => ({
          id: app._id,
          jobTitle: app.offerId?.title || 'N/A',
          companyName: app.offerId?.organizationId?.name || 'N/A',
          status: app.status,
          appliedDate: app.createdAt,
        }));
        
        setApplications(mappedApplications);
      } catch (err) {
        setError('Erreur lors du chargement des candidatures');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [developerId]);

  if (loading) {
    return <div className={styles.loading}>Chargement des candidatures...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (applications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Aucune candidature pour le moment</p>
      </div>
    );
  }

  return (
    <div className={styles.applicationsContainer}>
      <h2>Mes candidatures</h2>
      <div className={styles.applicationsList}>
        {applications.map((app) => (
          <div key={app.id} className={styles.applicationCard}>
            <div className={styles.applicationHeader}>
              <h3>{app.jobTitle}</h3>
              <span className={`${styles.status} ${styles[app.status]}`}>
                {app.status}
              </span>
            </div>
            <p className={styles.company}>{app.companyName}</p>
            <p className={styles.date}>
              Candidaté le {new Date(app.appliedDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperApplications;