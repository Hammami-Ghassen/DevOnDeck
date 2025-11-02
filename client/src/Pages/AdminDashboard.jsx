import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DeveloperList from '../components/DeveloperList';
import EditDeveloperModal from '../components/EditDeveloperModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { getDevelopers, updateDeveloper, deleteDeveloper } from '../api';
import '../Styles/Dashboard.css';

const AdminDashboard = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [deletingDeveloper, setDeletingDeveloper] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadDevelopers();
  }, []);

  const loadDevelopers = async () => {
    try {
      setLoading(true);
      const data = await getDevelopers();
      setDevelopers(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les développeurs. Vérifiez que json-server est lancé sur le port 5000.');
      console.error('Erreur de chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleEdit = (developer) => {
    setEditingDeveloper(developer);
  };

  const handleSave = async (updatedDeveloper) => {
    try {
      await updateDeveloper(updatedDeveloper.id, updatedDeveloper);
      setDevelopers(developers.map(dev => 
        dev.id === updatedDeveloper.id ? updatedDeveloper : dev
      ));
      setEditingDeveloper(null);
      showNotification('✓ Développeur modifié avec succès !');
    } catch (err) {
      showNotification('✗ Erreur lors de la modification', 'error');
      console.error('Erreur de modification:', err);
    }
  };

  const handleDelete = (developer) => {
    setDeletingDeveloper(developer);
  };

  const confirmDelete = async () => {
    try {
      await deleteDeveloper(deletingDeveloper.id);
      setDevelopers(developers.filter(dev => dev.id !== deletingDeveloper.id));
      setDeletingDeveloper(null);
      showNotification('✓ Développeur supprimé avec succès !');
    } catch (err) {
      showNotification('✗ Erreur lors de la suppression', 'error');
      console.error('Erreur de suppression:', err);
    }
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="dashboard">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Tableau de bord</h2>
          <p className="dashboard-subtitle">
            Gérez tous les développeurs inscrits sur la plateforme
          </p>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon developers">
              👨‍💻
            </div>
            <div className="stat-info">
              <h3>{developers.length}</h3>
              <p>Développeurs actifs</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="loading">
            ⏳ Chargement des développeurs...
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {!loading && !error && (
          <DeveloperList 
            developers={developers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {editingDeveloper && (
        <EditDeveloperModal
          developer={editingDeveloper}
          onClose={() => setEditingDeveloper(null)}
          onSave={handleSave}
        />
      )}

      {deletingDeveloper && (
        <DeleteConfirmModal
          developer={deletingDeveloper}
          onClose={() => setDeletingDeveloper(null)}
          onConfirm={confirmDelete}
        />
      )}

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;