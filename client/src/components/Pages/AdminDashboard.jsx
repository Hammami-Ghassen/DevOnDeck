import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DeveloperList from '../components/DeveloperList';
import EditDeveloperModal from '../components/EditDeveloperModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import '../Styles/Dashboard.css';

// Base URL for the API (fallback to localhost:5000)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fetch helpers replacing ../api module
async function getDevelopers() {
  const res = await fetch(`${API_URL}/admin/developers`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to fetch developers');
  return res.json();
}

async function updateDeveloper(id, updates) {
  const res = await fetch(`${API_URL}/admin/developers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to update developer');
  return res.json();
}

async function deleteDeveloper(id) {
  const res = await fetch(`${API_URL}/admin/developers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to delete developer');
  return res.json();
}

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
      setDevelopers((prev) => prev.filter((d) => String(d._id) !==String(deletingDeveloper._id)));
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