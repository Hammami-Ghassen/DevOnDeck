import React from 'react';
import styles from '../Styles/OrganizationList.module.css';

const OrganizationList = ({ organizations, onEdit, onDelete }) => {
  if (!organizations || organizations.length === 0) {
    return <p className={styles.emptyMessage}>Aucune organisation trouvée.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Localisation</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {organizations.map((org) => (
          <tr key={org._id}>
            <td>{org.name}</td>
            <td>{org.email}</td>
            <td>{org.localisation || '-'}</td>
            <td>
              <div className={styles.actions}>
                {onEdit && (
                  <button 
                    className={styles.editBtn} 
                    onClick={() => onEdit(org)}
                  >
                    Modifier
                  </button>
                )}
                {onDelete && (
                  <button 
                    className={styles.deleteBtn} 
                    onClick={() => onDelete(org)}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrganizationList;