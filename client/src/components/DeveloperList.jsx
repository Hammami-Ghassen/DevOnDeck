import React from 'react';
import DeveloperCard from './DeveloperCard';
import '../Styles/DeveloperCard.css';

const DeveloperList = ({ developers, onEdit, onDelete }) => {
  if (developers.length === 0) {
    return (
      <div className="loading">
        Aucun développeur trouvé.
      </div>
    );
  }

  return (
    <div className="developer-list">
      {developers.map((developer) => (
        <DeveloperCard
          key={developer.id}
          developer={developer}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DeveloperList;