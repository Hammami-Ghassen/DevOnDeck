import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import styles from "../Styles/DeveloperProfile.module.css";

const DeveloperProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const res = await axios.get(`/users/${id}`);
        setDeveloper(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError("Erreur lors du chargement du profil.");
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDeveloper();
  }, [id, navigate]);

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
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError("Erreur lors de la mise à jour du profil.");
      }
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
    setIsEditing(!isEditing);
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
        <p>{error}</p>
        <button onClick={() => navigate('/login')} className={styles.btnPrimary}>
          Retour à la connexion
        </button>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        {/* Header with Avatar and Actions */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarPreview}>
              {developer.avatar ? (
                <img src={developer.avatar} alt={developer.name} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {developer.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.profileTitle}>{developer.name || "Nom du développeur"}</h1>
              <p className={styles.profileRole}>👨‍💻 {developer.role === 'developer' ? 'Développeur' : 'Utilisateur'}</p>
              {developer.localisation && (
                <p className={styles.profileLocation}>📍 {developer.localisation}</p>
              )}
            </div>
          </div>

          <div className={styles.headerActions}>
            <button 
              onClick={toggleEdit}
              className={`${styles.btn} ${styles.btnEdit}`}
              title={isEditing ? "Annuler" : "Modifier le profil"}
            >
              {isEditing ? "❌ Annuler" : "✏️ Modifier"}
            </button>
            <button 
              onClick={handleLogout}
              className={`${styles.btn} ${styles.btnLogout}`}
              title="Déconnexion"
            >
              🚪 Déconnexion
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className={styles.alertSuccess}>
            ✓ {success}
          </div>
        )}

        {error && (
          <div className={styles.alertError}>
            ✗ {error}
          </div>
        )}

        {/* Bio Section */}
        <div className={styles.bioSection}>
          <h3 className={styles.sectionTitle}>📝 À propos</h3>
          <div className={styles.sectionContent}>
            {isEditing ? (
              <textarea
                name="bio"
                value={developer.bio || ""}
                onChange={handleChange}
                placeholder="Décrivez votre parcours, vos passions..."
                className={styles.textarea}
                rows="4"
              />
            ) : (
              <p className={styles.bioText}>
                {developer.bio || "Aucune biographie disponible"}
              </p>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>💻 Compétences</h3>
          <div className={styles.sectionContent}>
            {isEditing ? (
              <div>
                <input
                  name="skills"
                  value={developer.skills ? developer.skills.join(", ") : ""}
                  onChange={(e) =>
                    setDeveloper({
                      ...developer,
                      skills: e.target.value.split(",").map((s) => s.trim()).filter(s => s),
                    })
                  }
                  placeholder="JavaScript, React, Node.js..."
                  className={styles.input}
                />
                <span className={styles.inputHint}>Séparez les compétences par des virgules</span>
              </div>
            ) : (
              <div className={styles.skillsList}>
                {developer.skills && developer.skills.length > 0 ? (
                  developer.skills.map((skill, index) => (
                    <span key={index} className={styles.skillBadge}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className={styles.emptyState}>Aucune compétence ajoutée</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Frameworks Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>🔧 Frameworks & Outils</h3>
          <div className={styles.sectionContent}>
            {isEditing ? (
              <div>
                <input
                  name="frameworks"
                  value={developer.frameworks ? developer.frameworks.join(", ") : ""}
                  onChange={(e) =>
                    setDeveloper({
                      ...developer,
                      frameworks: e.target.value.split(",").map((f) => f.trim()).filter(f => f),
                    })
                  }
                  placeholder="Express, Django, Docker..."
                  className={styles.input}
                />
                <span className={styles.inputHint}>Séparez les frameworks par des virgules</span>
              </div>
            ) : (
              <div className={styles.frameworksList}>
                {developer.frameworks && developer.frameworks.length > 0 ? (
                  developer.frameworks.map((framework, index) => (
                    <span key={index} className={styles.frameworkBadge}>
                      {framework}
                    </span>
                  ))
                ) : (
                  <p className={styles.emptyState}>Aucun framework ajouté</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📞 Informations de contact</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Nom complet</label>
                <input
                  type="text"
                  name="name"
                  value={developer.name || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email principal</label>
                <input
                  type="email"
                  name="email"
                  value={developer.email || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email de contact</label>
                <input
                  type="email"
                  name="mail"
                  value={developer.contact?.mail || ""}
                  onChange={handleContactChange}
                  disabled={!isEditing}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="numero"
                  value={developer.contact?.numero || ""}
                  onChange={handleContactChange}
                  disabled={!isEditing}
                  placeholder="+216 XX XXX XXX"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Localisation</label>
                <input
                  type="text"
                  name="localisation"
                  value={developer.localisation || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Ville, Pays"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Avatar (URL)</label>
                <input
                  type="url"
                  name="avatar"
                  value={developer.avatar || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://..."
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={`${styles.btn} ${styles.btnSave}`}
                disabled={saving}
              >
                {saving ? "💾 Enregistrement..." : "💾 Enregistrer les modifications"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeveloperProfile;