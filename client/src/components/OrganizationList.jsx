import React from 'react';
import styles from '../Styles/OrganizationList.module.css';

const OrganizationList = ({ organizations, onEdit, onDelete }) => {
  if (!organizations || organizations.length === 0) {
    return <p className={styles.emptyMessage}>No organizations found.</p>;
  }

  return (
    <div className={styles.organizationList}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Verified</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org._id}>
              <td>{org.name}</td>
              <td>{org.email}</td>
              <td>{org.website || 'N/A'}</td>
              <td>
                <span className={org.isVerified ? styles.verified : styles.unverified}>
                  {org.isVerified ? 'Yes' : 'No'}
                </span>
              </td>
              <td>{new Date(org.createdAt).toLocaleDateString()}</td>
              <td>
                <div className={styles.actions}>
                  {onEdit && (
                    <button
                      className={styles.editBtn}
                      onClick={() => onEdit(org)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDelete(org)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizationList;