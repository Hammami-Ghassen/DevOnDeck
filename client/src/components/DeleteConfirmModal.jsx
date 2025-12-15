import React from 'react';
import styles from '../Styles/Modal.module.css';

const DeleteConfirmModal = ({ developer, onClose, onConfirm }) => {
  const handleOverlayClick = (e) => {
    if (e.target.className.includes('modalOverlay')) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>⚠️ Confirmation de suppression</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.deleteConfirmation}>
          <div className={styles.warningIcon}>
            ⚠️
          </div>
          <h3>Êtes-vous sûr ?</h3>
          <p>
            Vous êtes sur le point de supprimer le développeur{' '}
            <span className={styles.developerNameHighlight}>
              {developer.name}
            </span>
            . Cette action est irréversible.
          </p>

          <div className={styles.deleteActions}>
            <button 
              className={styles.btnConfirmDelete}
              onClick={onConfirm}
              type="button"
            >
              ✓ Oui, supprimer
            </button>
            <button 
              className={styles.cancelBtn}
              onClick={onClose}
              type="button"
            >
              ✗ Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;