import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Header from '../components/Header';
import DeveloperList from '../components/DeveloperList';
import OrganizationList from '../components/OrganizationList';
import EditDeveloperModal from '../components/EditDeveloperModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import styles from '../Styles/Dashboard.module.css';

async function getUsers() {
  const response = await axios.get('/admin/users');
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [deletingDeveloper, setDeletingDeveloper] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await getUsers();
        
        // Separate by role
        setDevelopers(users.filter(user => user.role === 'developer'));
        setOrganizations(users.filter(user => user.role === 'organization'));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleEditDeveloper = useCallback((developer) => {
    setEditingDeveloper(developer);
  }, []);

  const handleDeleteDeveloper = useCallback((developer) => {
    setDeletingDeveloper(developer);
  }, []);

  const handleSaveDeveloper = async (updates) => {
    try {
      await updateDeveloper(editingDeveloper._id, updates);
      const users = await getUsers();
      setDevelopers(users.filter(user => user.role === 'developer'));
      setOrganizations(users.filter(user => user.role === 'organization'));
      setEditingDeveloper(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDeveloper(deletingDeveloper._id);
      const users = await getUsers();
      setDevelopers(users.filter(user => user.role === 'developer'));
      setOrganizations(users.filter(user => user.role === 'organization'));
      setDeletingDeveloper(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.dashboardHeader}>
          <div>
            <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
            <p className={styles.dashboardSubtitle}>Manage developers and organizations</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
        <div className={styles.container}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <Header onLogout={handleLogout} />
        <div className={styles.container}>
          <p className={styles.error}>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Header />
      <button onClick={handleLogout} className={styles.logoutBtn}>
        Logout
      </button>
      
      <div className={styles.container}>
        <h1>Admin Dashboard</h1>

        {/* Developers Section */}
        <div className={styles.section}>
          <h2>Developers</h2>
          <DeveloperList
            developers={developers}
            onEdit={handleEditDeveloper}
            onDelete={handleDeleteDeveloper}
          />
        </div>

        {/* Organizations Section */}
        <div className={styles.section}>
          <h2>Organizations</h2>
          <OrganizationList 
            organizations={organizations}
            onEdit={null}
            onDelete={null}
          />
        </div>
      </div>

      {editingDeveloper && (
        <EditDeveloperModal
          developer={editingDeveloper}
          onSave={handleSaveDeveloper}
          onClose={() => setEditingDeveloper(null)}
        />
      )}

      {deletingDeveloper && (
        <DeleteConfirmModal
          developer={deletingDeveloper}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingDeveloper(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;