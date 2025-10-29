import React from 'react';
import { useAuth } from '../context/AuthContext';
import DeveloperProfile from '../components/developer/DeveloperProfile';

const DeveloperDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>📊 Tableau de bord Développeur</h1>
      <p>Bienvenue, {user?.name} ! Complétez votre profil pour être visible par les recruteurs.</p>
      
      <div className="card">
        <DeveloperProfile />
      </div>

      <div className="card">
        <h3>📈 Statistiques</h3>
        <p>Votre profil est complet à 60%</p>
        <div style={{ 
          background: '#ecf0f1', 
          borderRadius: '10px', 
          height: '20px',
          margin: '1rem 0'
        }}>
          <div style={{
            background: '#3498db',
            height: '100%',
            width: '60%',
            borderRadius: '10px'
          }}></div>
        </div>
      </div>

      <div className="card">
        <h3>💼 Offres recommandées</h3>
        <p>Aucune offre recommandée pour le moment. Complétez votre profil pour recevoir des suggestions personnalisées.</p>
      </div>
    </div>
  );
};

export default DeveloperDashboard;