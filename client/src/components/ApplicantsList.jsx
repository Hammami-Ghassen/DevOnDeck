import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicantCard from './ApplicantsCard';
import Header from './Header';
import styles from '../Styles/ApplicantsList.module.css';

const ApplicantsList = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { offerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        // 1. Récupérer les IDs des candidats de l'offre
        const response = await axios.get(`http://localhost:5000/developers/offers/${offerId}`);
        const applicantIds = response.data.applicants;

        // 2. Pour chaque ID, récupérer les détails du développeur
        const developerPromises = applicantIds.map(id =>
          axios.get(`http://localhost:5000/users/${id}`)
        );
        
        const developersData = await Promise.all(developerPromises);
        setDevelopers(developersData.map(res => res.data));
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [offerId]);

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

  if (developers.length === 0) {
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
            <h3>{developers.length}</h3>
            <p>Candidat{developers.length > 1 ? 's' : ''} postulé{developers.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className={styles.developersList}>
          {developers.map((developer, index) => (
            <div 
              key={developer._id} 
              className={styles.developerCardWrapper}
              style={{ animationDelay: `${0.1 * (index % 6)}s` }}
            >
              <ApplicantCard developer={developer} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ApplicantsList;