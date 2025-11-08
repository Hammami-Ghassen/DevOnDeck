import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DeveloperList from '../components/DeveloperList';
import EditDeveloperModal from '../components/EditDeveloperModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import styles from '../Styles/Dashboard.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

async function getDevelopers() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/admin/developers`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    if (res.status === 401) {
      // Token invalid or expired
      throw new Error('UNAUTHORIZED');
    }
    throw new Error((await res.json().catch(() => ({}))).message || 'Failed to fetch developers');
  }
  return res.json();
}

async function updateDeveloper(id, updates) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/admin/developers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to update developer');
  return res.json();
}

async function deleteDeveloper(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/admin/developers/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to delete developer');
  return res.json();
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [deletingDeveloper, setDeletingDeveloper] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Check if user is authenticated and is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    if (!token || !user._id) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      navigate('/'); // Not admin, redirect to home
      return;
    }

    loadDevelopers();
  }, [navigate]);

  const loadDevelopers = async () => {
    try {
      setLoading(true);
      const data = await getDevelopers();
      setDevelopers(data);
      setError(null);
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      setError("Impossible de charger les développeurs. Assurez-vous que l'API Express tourne sur le port 5000.");
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

  return (
    <div className="app-container">
      <Header />
      
      <main className={styles.dashboard}>
        <div className={styles.dashboardHeader}>
          <h2 className={styles.dashboardTitle}>Tableau de bord</h2>
          <p className={styles.dashboardSubtitle}>
            Gérez tous les développeurs inscrits sur la plateforme
          </p>
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