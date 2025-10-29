import React from 'react';
import { useAuth } from '../context/AuthContext';
import JobCreation from '../components/organization/JobCreation';

const OrganizationDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>📊 Tableau de bord Organisation</h1>
      <p>Bienvenue, {user?.name} ! Créez des offres pour attirer les meilleurs talents.</p>
      
      <div className="card">
        <JobCreation />
      </div>

      <div className="card">
        <h3>📋 Vos offres actives</h3>
        <p>Aucune offre active pour le moment. Créez votre première offre !</p>
      </div>

      <div className="card">
        <h3>👥 Candidats récents</h3>
        <p>Aucun candidat pour le moment. Vos offres apparaîtront ici lorsqu'elles seront publiées.</p>
      </div>
    </div>
  );
};

export default OrganizationDashboard;