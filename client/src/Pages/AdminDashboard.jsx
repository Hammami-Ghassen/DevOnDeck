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

async function deleteUser(id) {
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
  const [deletingUser, setDeletingUser] = useState(null);

  const handleError = useCallback((err, action = 'loading') => {
    console.error(`Error during ${action}:`, err);

    if (err.response?.status === 401) {                         //Unauthorized
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/login');
    } else if (err.response?.status === 403) {                  //pas autorisé
      navigate('/forbidden');
    } else if (err.response?.status === 404) {
      setError(err.response?.data?.message || "Ressource non trouvée");
    } else if (err.response?.status >= 500) {
      setError("Erreur serveur. Veuillez réessayer plus tard.");
    } else {
      setError(err.response?.data?.message || "Une erreur est survenue");
    }
  }, [navigate]);


  //charge automatiquement la liste des développeurs + organisations 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const users = await getUsers();
        
        //sépare les développeurs et les organisations
        setDevelopers(users.filter(user => user.role === 'developer'));
        setOrganizations(users.filter(user => user.role === 'organization'));

      } catch (err) {
        handleError(err, 'fetching users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [handleError]);

//Modifier un développeur
  const handleEditDeveloper = useCallback((developer) => {
    setEditingDeveloper(developer);           //Met à jour l'état avec le développeur à modifier
  }, []);

// supprimer un développeur
  const handleDeleteDeveloper = useCallback((developer) => {
    setDeletingUser({ ...developer, type: 'developer' });
  }, []);

  const handleDeleteOrganization = useCallback((organization) => {
    setDeletingUser({ ...organization, type: 'organization' });
  }, []);


//sauvegarde les modifications d'un développeur 
  const handleSaveDeveloper = async (updates) => {
    try {
      setError(null);

      //Envoyer les modifications au serveur
      await updateDeveloper(editingDeveloper._id, updates);             //Fonction définie en haut du fichier
      const users = await getUsers();                                     //Évite les incohérences

      //Filtrer et mettre à jour les développeurs et organisations
      setDevelopers(users.filter(user => user.role === 'developer'));
      setOrganizations(users.filter(user => user.role === 'organization'));

      setEditingDeveloper(null);
    } catch (err) {
      handleError(err, 'updating developer');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setError(null);
      await deleteUser(deletingUser._id);
      const users = await getUsers();

      setDevelopers(users.filter(user => user.role === 'developer'));
      setOrganizations(users.filter(user => user.role === 'organization'));
      setDeletingUser(null);
    } catch (err) {
      handleError(err, 'deleting user');
    }
  };



  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
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
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <Header onLogout={handleLogout} />
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3>Erreur</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.btnPrimary}>
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header/>
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <h1>Admin Dashboard</h1>

        {/* Developers Section */}
        <div className={styles.devsection}>
          <h2>Developers</h2>
          <DeveloperList
            developers={developers}
            onEdit={handleEditDeveloper}
            onDelete={handleDeleteDeveloper}
          />
        </div>

        {/* Organizations Section */}
        <div className={styles.orgsection}>
          <h2>Organizations</h2>
          <OrganizationList 
            organizations={organizations}
            onEdit={null}
            onDelete={handleDeleteOrganization}
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

      {deletingUser && (
        <DeleteConfirmModal
          developer={deletingUser}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingUser(null)}
        />
      )}
    </div>
    </>
  );
};

export default AdminDashboard;