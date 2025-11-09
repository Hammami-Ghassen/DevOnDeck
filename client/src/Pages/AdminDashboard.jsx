import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Header from '../components/Header';
import DeveloperList from '../components/DeveloperList';
import EditDeveloperModal from '../components/EditDeveloperModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import styles from '../Styles/Dashboard.module.css';

async function getDevelopers() {
  const response = await axios.get('/admin/developers');
  return response.data;
}

async function updateDeveloper(id, updates) {
  const response = await axios.put(`/admin/developers/${id}`, updates);
  return response.data;
}

async function deleteDeveloper(id) {
  const response = await axios.delete(`/admin/developers/${id}`);
  return response.data;
}

const loadDevelopers = async () => {
  try {
    setLoading(true);
    const data = await getDevelopers();
    setDevelopers(data);
    setError(null);
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }
    setError("Impossible de charger les développeurs.");
    console.error('Erreur de chargement:', err);
  } finally {
    setLoading(false);
  }
};
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [deletingDeveloper, setDeletingDeveloper] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken || !user._id) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadDevelopers();
  }, [navigate]);


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
      const updated = await updateDeveloper(updatedDeveloper._id, updatedDeveloper);
      setDevelopers((prev) => prev.map((d) => (String(d._id) === String(updatedDeveloper._id) ? updated : d)));
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
      await deleteDeveloper(deletingDeveloper._id);
      setDevelopers((prev) => prev.filter((d) => String(d._id) !== String(deletingDeveloper._id)));
      setDeletingDeveloper(null);
      showNotification('✓ Développeur supprimé avec succès !');
    } catch (err) {
      showNotification('✗ Erreur lors de la suppression', 'error');
      console.error('Erreur de suppression:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className={styles.dashboard}>
        <div className={styles.dashboardHeader}>
          <div>
            <h2 className={styles.dashboardTitle}>Tableau de bord</h2>
            <p className={styles.dashboardSubtitle}>
              Gérez tous les développeurs inscrits sur la plateforme
            </p>
          </div>
          
          {/* Logout button */}
          <button 
            onClick={handleLogout}
            className={styles.logoutBtn}
            title="Déconnexion"
          >
            🚪 Déconnexion
          </button>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.developers}`}>
              👨‍💻
            </div>
            <div className={styles.statInfo}>
              <h3>{developers.length}</h3>
              <p>Développeurs actifs</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className={styles.loading}>
            ⏳ Chargement des développeurs...
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage}>
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