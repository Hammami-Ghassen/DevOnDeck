import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Header from '../components/Header';
import styles from '../Styles/CreateOffer.module.css';

const CreateOffer = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requiredSkills: '',
        requiredFrameworks: '',
        preferredLocalisation: '',
        experienceLevel: '',
        contractType: '',
        salaryMin: '',
        salaryMax: '',
        status: 'active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Prepare data
            const offerData = {
                title: formData.title,
                description: formData.description,
                requiredSkills: formData.requiredSkills 
                    ? formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s)
                    : [],
                requiredFrameworks: formData.requiredFrameworks
                    ? formData.requiredFrameworks.split(',').map(s => s.trim()).filter(s => s)
                    : [],
                preferredLocalisation: formData.preferredLocalisation,
                experienceLevel: formData.experienceLevel,
                contractType: formData.contractType,
                salary: {
                    min: formData.salaryMin ? parseFloat(formData.salaryMin) : 0,
                    max: formData.salaryMax ? parseFloat(formData.salaryMax) : 0
                },
                status: formData.status
            };

            // Send to backend
            const response = await axios.post('/organization/offers', offerData);
            
            setSuccess(true);
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/organization/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Erreur création offre:', err);
            setError(err.response?.data?.message || "Erreur lors de la création de l'offre");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.createOfferPage}>
            <Header />
            
            <div className={styles.container}>
                <div className={styles.formWrapper}>
                    <h1 className={styles.title}>Créer une nouvelle offre</h1>
                    <p className={styles.subtitle}>
                        Publiez une offre pour attirer les meilleurs développeurs
                    </p>

                    {error && (
                        <div className={styles.alert} role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className={styles.success} role="alert">
                            ✅ Offre créée avec succès ! Redirection...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Titre */}
                        <div className={styles.formGroup}>
                            <label htmlFor="title" className={styles.label}>
                                Titre du poste <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Ex: Développeur Full Stack Senior"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className={styles.formGroup}>
                            <label htmlFor="description" className={styles.label}>
                                Description <span className={styles.required}>*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={styles.textarea}
                                placeholder="Décrivez le poste, les responsabilités, l'équipe..."
                                rows="6"
                                required
                            />
                        </div>

                        {/* Skills */}
                        <div className={styles.formGroup}>
                            <label htmlFor="requiredSkills" className={styles.label}>
                                Compétences requises
                            </label>
                            <input
                                type="text"
                                id="requiredSkills"
                                name="requiredSkills"
                                value={formData.requiredSkills}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Ex: JavaScript, Python, SQL (séparés par des virgules)"
                            />
                            <small className={styles.hint}>Séparez les compétences par des virgules</small>
                        </div>

                        {/* Frameworks */}
                        <div className={styles.formGroup}>
                            <label htmlFor="requiredFrameworks" className={styles.label}>
                                Frameworks/Technologies
                            </label>
                            <input
                                type="text"
                                id="requiredFrameworks"
                                name="requiredFrameworks"
                                value={formData.requiredFrameworks}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Ex: React, Node.js, MongoDB (séparés par des virgules)"
                            />
                            <small className={styles.hint}>Séparez les frameworks par des virgules</small>
                        </div>

                        {/* Two column layout */}
                        <div className={styles.formRow}>
                            {/* Experience Level */}
                            <div className={styles.formGroup}>
                                <label htmlFor="experienceLevel" className={styles.label}>
                                    Niveau d'expérience
                                </label>
                                <select
                                    id="experienceLevel"
                                    name="experienceLevel"
                                    value={formData.experienceLevel}
                                    onChange={handleChange}
                                    className={styles.select}
                                >
                                    <option value="">Sélectionner...</option>
                                    <option value="junior">Junior</option>
                                    <option value="intermediate">Intermédiaire</option>
                                    <option value="senior">Senior</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </div>

                            {/* Contract Type */}
                            <div className={styles.formGroup}>
                                <label htmlFor="contractType" className={styles.label}>
                                    Type de contrat
                                </label>
                                <select
                                    id="contractType"
                                    name="contractType"
                                    value={formData.contractType}
                                    onChange={handleChange}
                                    className={styles.select}
                                >
                                    <option value="">Sélectionner...</option>
                                    <option value="CDI">CDI</option>
                                    <option value="CDD">CDD</option>
                                    <option value="freelance">Freelance</option>
                                    <option value="stage">Stage</option>
                                </select>
                            </div>
                        </div>

                        {/* Localisation */}
                        <div className={styles.formGroup}>
                            <label htmlFor="preferredLocalisation" className={styles.label}>
                                Localisation
                            </label>
                            <input
                                type="text"
                                id="preferredLocalisation"
                                name="preferredLocalisation"
                                value={formData.preferredLocalisation}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Ex: Paris, Remote, Hybride"
                            />
                        </div>

                        {/* Salary */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="salaryMin" className={styles.label}>
                                    Salaire min (€/an)
                                </label>
                                <input
                                    type="number"
                                    id="salaryMin"
                                    name="salaryMin"
                                    value={formData.salaryMin}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="35000"
                                    min="0"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="salaryMax" className={styles.label}>
                                    Salaire max (€/an)
                                </label>
                                <input
                                    type="number"
                                    id="salaryMax"
                                    name="salaryMax"
                                    value={formData.salaryMax}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="50000"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className={styles.formGroup}>
                            <label htmlFor="status" className={styles.label}>
                                Statut de l'offre
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="active">Active (publié)</option>
                                <option value="draft">Brouillon</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className={styles.buttonGroup}>
                            <button
                                type="button"
                                onClick={() => navigate('/organization/dashboard')}
                                className={styles.cancelButton}
                                disabled={loading}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Création...' : 'Créer l\'offre'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateOffer;
