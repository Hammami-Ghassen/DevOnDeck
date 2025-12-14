import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeveloperListOffer from './DeveloperListOffer';
import styles from '../Styles/ApplicantsList.module.css';
import styles2 from '../Styles/Test.module.css';

const ApplicantsList = ({ offerId }) => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (developers.length === 0) return <div>Aucun candidat</div>;

  return (
    <div className={styles2.container}>
      <h1 className={styles2.pageTitle}>Liste des candidats pour l'offre</h1>
      <h2 className={styles.title} >Candidats ({developers.length})</h2>
      {developers.map(developer => (
        <DeveloperListOffer key={developer._id} developer={developer} />
      ))}
    </div>
  );
};

export default ApplicantsList;