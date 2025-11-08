import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/DeveloperProfile.css";

const DeveloperProfile = ({ userId }) => {
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`);
        setDeveloper(res.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchDeveloper();
  }, [userId]);

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
      await axios.put(`http://localhost:5000/users/${userId}`, developer);
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
    <div className="profile-card">
      <div className="profile-header">
        <div className="avatar-preview">
          {developer.avatar ? (
            <img src={developer.avatar} alt="avatar" />
          ) : (
            <span>Avatar</span>
          )}
        </div>
        <div className="profile-info">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="edit-icon" onClick={toggleEdit}>
              {isEditing ? "💾" : "✏️"}
            </span>
          </div>
          <h2 className="profile-title">{developer.name || "Nom Développeur"}</h2>
          <p className="profile-subtitle">{developer.bio || "Bio courte..."}</p>
        </div>
      </div>

      {/* FORMULAIRE */}
      <form className="profile-form" onSubmit={handleSubmit}>
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
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Sauvegarde..." : "Enregistrer"}
            </button>
        )}



        {error && <p className="status status-error">{error}</p>}
        {success && <p className="status status-success">{success}</p>}
      </form>
    </div>
  );
};

export default DeveloperProfile;
