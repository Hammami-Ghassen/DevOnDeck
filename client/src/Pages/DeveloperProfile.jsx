import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../Styles/DeveloperProfile.module.css";

const DeveloperProfile = () => {
  const { id } = useParams();
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDeveloper = async () => {
      console.log('Fetching developer with ID:', id);
      try {
        const res = await axios.get(`http://localhost:5000/users/${id}`);
        setDeveloper(res.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDeveloper();
  }, [id]);

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
      await axios.put(`http://localhost:5000/users/${id}`, developer);
      setSuccess("Profil mis à jour avec succès !");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  if (loading) return <p>Chargement du profil...</p>;
  if (error && !developer) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarPreview}>
          {developer.avatar ? (
            <img src={developer.avatar} alt="avatar" />
          ) : (
            <span>Avatar</span>
          )}
        </div>
        <div className={styles.profileInfo}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 className={styles.profileTitle}>{developer.name || "Nom Développeur"}</h2>
            <span className={styles.editIcon} onClick={toggleEdit}>
              {isEditing ? "💾" : "✏️"}
            </span>
          </div>
          <p className={styles.profileSubtitle}>{developer.bio || "Bio courte..."}</p>
        </div>
      </div>

      <form className={styles.profileForm} onSubmit={handleSubmit}>
        <label>Nom :</label>
        <input
          name="name"
          value={developer.name || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Email :</label>
        <input
          name="email"
          type="email"
          value={developer.email || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Bio :</label>
        <textarea
          name="bio"
          value={developer.bio || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Compétences (séparées par des virgules) :</label>
        <input
          name="skills"
          value={developer.skills ? developer.skills.join(", ") : ""}
          onChange={(e) =>
            setDeveloper({
              ...developer,
              skills: e.target.value.split(",").map((s) => s.trim()),
            })
          }
          disabled={!isEditing}
        />

        <label>Frameworks (séparés par des virgules) :</label>
        <input
          name="frameworks"
          value={developer.frameworks ? developer.frameworks.join(", ") : ""}
          onChange={(e) =>
            setDeveloper({
              ...developer,
              frameworks: e.target.value.split(",").map((f) => f.trim()),
            })
          }
          disabled={!isEditing}
        />

        <label>Localisation :</label>
        <input
          name="localisation"
          value={developer.localisation || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <h4>Contact</h4>
        <label>Email de contact :</label>
        <input
          name="mail"
          value={developer.contact?.mail || ""}
          onChange={handleContactChange}
          disabled={!isEditing}
        />

        <label>Numéro :</label>
        <input
          name="numero"
          value={developer.contact?.numero || ""}
          onChange={handleContactChange}
          disabled={!isEditing}
        />

        <label>Avatar (URL) :</label>
        <input
          name="avatar"
          value={developer.avatar || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />

        {isEditing && ( 
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              {saving ? "Sauvegarde..." : "Enregistrer"}
            </button>
        )}

        {error && <p className={`${styles.status} ${styles.statusError}`}>{error}</p>}
        {success && <p className={`${styles.status} ${styles.statusSuccess}`}>{success}</p>}
      </form>
    </div>
  );
};

export default DeveloperProfile;