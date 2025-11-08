import React from 'react';
import DeveloperCard from './DeveloperCard';
import styles from '../Styles/DeveloperCard.module.css';

const DeveloperList = ({ developers, onEdit, onDelete }) => {
  return (
    <div className={styles.developerList}>
      {developers.map((developer) => (
        <DeveloperCard
          key={developer._id}
          developer={developer}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DeveloperList;