import React from 'react';
import '../Styles/Modal.css';

const DeleteConfirmModal = ({ developer, onClose, onConfirm }) => {
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>⚠️ Confirmation de suppression</h2>
          <button className="close-btn" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className="delete-confirmation">
          <div className="warning-icon">🗑️</div>
          <h3>Êtes-vous sûr ?</h3>
          <p>
            Vous êtes sur le point de supprimer le compte de{' '}
            <span className="developer-name-highlight">
              {developer.name}
            </span>.
            <br />
            Cette action est <strong>irréversible</strong>.
          </p>

          <div className="delete-actions">
            <button 
              className="btn-confirm-delete"
              onClick={onConfirm}
              type="button"
            >
              ✓ Oui, supprimer
            </button>
            <button 
              className="btn-cancel"
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