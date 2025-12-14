import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import styles from "../Styles/DeveloperProfile.module.css";
import EditDeveloperModal from "../components/EditDeveloperModal";

const DeveloperProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleError = useCallback((err, action = 'loading') => {
    console.error(`Error during ${action}:`, err);
    
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/login');
    } else if (err.response?.status === 403) {
      navigate('/forbidden');
    } else if (err.response?.status === 404) {
      setError(err.response?.data?.message || "Profil non trouvé");
    } else if (err.response?.status >= 500) {
      setError("Erreur serveur. Veuillez réessayer plus tard.");
    } else {
      setError(err.response?.data?.message || "Une erreur est survenue");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const res = await axios.get(`/users/${id}`);
        setDeveloper(res.data);
        
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const canEditProfile = 
          currentUser._id === id || 
          currentUser.role === 'admin';
        setCanEdit(canEditProfile);
        
      } catch (err) {
        handleError(err, 'fetching');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDeveloper();
  }, [id, handleError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeveloper({ ...developer, [name]: value });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setDeveloper({
      ...developer,
      contact: { ...developer.contact, [name]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      await axios.put(`/users/${id}`, developer);
      setSuccess("Profil mis à jour avec succès !");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      handleError(err, 'updating');
    } finally {
      setSaving(false);
    }
  };

  const handleModalSave = async (updatedDeveloper) => {
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      await axios.put(`/users/${id}`, updatedDeveloper);
      setDeveloper(updatedDeveloper);
      setSuccess("Profil mis à jour avec succès !");
      setIsModalOpen(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      handleError(err, 'updating');
    } finally {
      setSaving(false);
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

  const toggleEdit = () => {
    setIsModalOpen(true);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  if (error && !developer) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Erreur</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className={styles.btnPrimary}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className={styles.fullWidthContainer}>
      {/* Fixed Header with Avatar and Name */}
      <div className={styles.profileHeader}>
        <div className={styles.headerContent}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {developer?.avatar ? (
                <img src={developer.avatar} alt={developer.name} className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {developer?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.userName}>{developer?.name || "Nom du développeur"}</h1>
              <p className={styles.userRole}>👨‍💻 {developer?.role === 'developer' ? 'Développeur' : 'Utilisateur'}</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {canEdit && (
              <button onClick={toggleEdit} className={styles.editBtn}>
                ✏️ Modifier
              </button>
            )}
            {localStorage.getItem('accessToken') && (
              <button onClick={handleLogout} className={styles.logoutBtn}>
                🚪 Déconnexion
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsBar}>
        <div className={styles.tabsWrapper}>
          <button
            className={`${styles.tabButton} ${activeTab === 'profile' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Informations
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'applications' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            📋 Candidatures
          </button>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className={styles.alertSuccess}>✓ {success}</div>
      )}
      {error && (
        <div className={styles.alertError}>✗ {error}</div>
      )}

      {/* Tab Content */}
      <div className={styles.contentWrapper}>
        {activeTab === 'profile' && (
          <div className={styles.tabContent}>
            {/* Bio Section */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>📝 À propos</h3>
              <div className={styles.cardContent}>
                <p className={styles.bioText}>
                  {developer?.bio || "Aucune biographie disponible"}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>💻 Compétences</h3>
              <div className={styles.cardContent}>
                <div className={styles.badgesList}>
                  {developer?.skills && developer.skills.length > 0 ? (
                    developer.skills.map((skill, index) => (
                      <span key={index} className={styles.skillBadge}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className={styles.emptyState}>Aucune compétence ajoutée</p>
                  )}
                </div>
              </div>
            </div>

            {/* Frameworks Section */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>🔧 Frameworks & Outils</h3>
              <div className={styles.cardContent}>
                <div className={styles.badgesList}>
                  {developer?.frameworks && developer.frameworks.length > 0 ? (
                    developer.frameworks.map((framework, index) => (
                      <span key={index} className={styles.frameworkBadge}>
                        {framework}
                      </span>
                    ))
                  ) : (
                    <p className={styles.emptyState}>Aucun framework ajouté</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {canEdit && (
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>📞 Informations de contact</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Nom complet</span>
                    <span className={styles.infoValue}>{developer?.name || "Non renseigné"}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email principal</span>
                    <span className={styles.infoValue}>{developer?.email || "Non renseigné"}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email de contact</span>
                    <span className={styles.infoValue}>{developer?.contact?.mail || "Non renseigné"}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Téléphone</span>
                    <span className={styles.infoValue}>{developer?.contact?.numero || "Non renseigné"}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Localisation</span>
                    <span className={styles.infoValue}>{developer?.localisation || "Non renseigné"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className={styles.tabContent}>
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>📋 Mes Candidatures</h3>
              <div className={styles.cardContent}>
                <p className={styles.emptyState}>Aucune candidature pour le moment</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <EditDeveloperModal
          developer={developer}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default DeveloperProfile;