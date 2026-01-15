import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicantCard from './ApplicantsCard';
import Header from './Header';
import styles from '../Styles/ApplicantsList.module.css';

const ApplicantsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { offerId } = useParams();
  const navigate = useNavigate();

  const fetchApplicants = async () => {
    try {
      // Récupérer les applications avec les détails des développeurs
      const response = await axios.get(`/developers/offers/${offerId}`);
      setApplications(response.data.applications || []);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [offerId]);

  // Fonction pour mettre à jour le statut localement après une action
  const handleStatusUpdate = (applicationId, newStatus) => {
    setApplications(prevApps => 
      prevApps.map(app => 
        app._id === applicationId 
          ? { ...app, status: newStatus }
          : app
      )
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Chargement des candidats...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.error}>
            ⚠️ Erreur: {error}
          </div>
        </div>
      </>
    );
  }

  if (applications.length === 0) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Liste des candidats</h1>
          <div className={styles.noApplicants}>
            <p>Aucun candidat n'a postulé pour cette offre</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <button 
          onClick={() => navigate(-1)} 
          className={styles.backButton}
        >
          ← Retour
        </button>

        <h1 className={styles.pageTitle}>Liste des candidats pour l'offre</h1>
        
        <div className={styles.statsCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <h3>{applications.length}</h3>
            <p>Candidat{applications.length > 1 ? 's' : ''} postulé{applications.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className={styles.developersList}>
          {applications.map((application, index) => (
            <div 
              key={application._id} 
              className={styles.developerCardWrapper}
              style={{ animationDelay: `${0.1 * (index % 6)}s` }}
            >
              <ApplicantCard 
                developer={application.developerId} 
                offerId={offerId}
                application={application}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ApplicantsList;