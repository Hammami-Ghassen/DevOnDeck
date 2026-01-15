import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axios';
import Header from '../components/Header';
import styles from '../Styles/CreateOffer.module.css';

const EditOffer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requiredSkills: [],
        requiredFrameworks: [],
        preferredLocalisation: '',
        experienceLevel: '',
        contractType: '',
        salaryMin: '',
        salaryMax: '',
        status: 'active'
    });

    const [skillInput, setSkillInput] = useState('');
    const [frameworkInput, setFrameworkInput] = useState('');

    // Fetch existing offer data
    useEffect(() => {
        const fetchOffer = async () => {
            try {
                setFetching(true);
                const response = await axios.get(`/offers/${id}`);
                const offer = response.data;

                setFormData({
                    title: offer.title || '',
                    description: offer.description || '',
                    requiredSkills: offer.requiredSkills || [],
                    requiredFrameworks: offer.requiredFrameworks || [],
                    preferredLocalisation: offer.preferredLocalisation || '',
                    experienceLevel: offer.experienceLevel || '',
                    contractType: offer.contractType || '',
                    salaryMin: offer.salary?.min?.toString() || '',
                    salaryMax: offer.salary?.max?.toString() || '',
                    status: offer.status || 'active'
                });
            } catch (err) {
                console.error('Erreur chargement offre:', err);
                setError('Erreur lors du chargement de l\'offre');
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchOffer();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };

    const addFramework = () => {
        if (frameworkInput.trim() && !formData.requiredFrameworks.includes(frameworkInput.trim())) {
            setFormData(prev => ({
                ...prev,
                requiredFrameworks: [...prev.requiredFrameworks, frameworkInput.trim()]
            }));
            setFrameworkInput('');
        }
    };

    const removeFramework = (frameworkToRemove) => {
        setFormData(prev => ({
            ...prev,
            requiredFrameworks: prev.requiredFrameworks.filter(fw => fw !== frameworkToRemove)
        }));
    };

    const handleSkillKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const handleFrameworkKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFramework();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const offerData = {
                title: formData.title,
                description: formData.description,
                requiredSkills: formData.requiredSkills,
                requiredFrameworks: formData.requiredFrameworks,
                preferredLocalisation: formData.preferredLocalisation,
                experienceLevel: formData.experienceLevel,
                contractType: formData.contractType,
                salary: {
                    min: formData.salaryMin ? parseFloat(formData.salaryMin) : 0,
                    max: formData.salaryMax ? parseFloat(formData.salaryMax) : 0
                },
                status: formData.status
            };

            await axios.put(`/organization/offers/${id}`, offerData);
            
            setSuccess(true);
            
            setTimeout(() => {
                navigate('/organization/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Erreur modification offre:', err);
            setError(err.response?.data?.message || "Erreur lors de la modification de l'offre");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className={styles.createOfferPage}>
                <Header />
                <div className={styles.container}>
                    <div className={styles.formWrapper}>
                        <p style={{ textAlign: 'center', padding: '2rem' }}>
                            Chargement de l'offre...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.createOfferPage}>
            <Header />
            
            <div className={styles.container}>
                <div className={styles.formWrapper}>
                    <h1 className={styles.title}>Modifier l'offre</h1>
                    <p className={styles.subtitle}>
                        Mettez à jour les informations de votre offre
                    </p>

                    {error && (
                        <div className={styles.alert} role="alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className={styles.success} role="alert">
                            ✅ Offre modifiée avec succès ! Redirection...
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
                            <label className={styles.label}>
                                Compétences requises
                            </label>
                            <div className={styles.tagInputWrapper}>
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={handleSkillKeyPress}
                                    className={styles.tagInput}
                                    placeholder="Ex: JavaScript, Python..."
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className={styles.addButton}
                                    disabled={!skillInput.trim()}
                                >
                                    <span className={styles.plusIcon}>+</span>
                                </button>
                            </div>
                            {formData.requiredSkills.length > 0 && (
                                <div className={styles.tagsContainer}>
                                    {formData.requiredSkills.map((skill, index) => (
                                        <span key={index} className={styles.tag}>
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className={styles.removeTag}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Frameworks */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Frameworks & Technologies
                            </label>
                            <div className={styles.tagInputWrapper}>
                                <input
                                    type="text"
                                    value={frameworkInput}
                                    onChange={(e) => setFrameworkInput(e.target.value)}
                                    onKeyPress={handleFrameworkKeyPress}
                                    className={styles.tagInput}
                                    placeholder="Ex: React, Node.js, Django..."
                                />
                                <button
                                    type="button"
                                    onClick={addFramework}
                                    className={styles.addButton}
                                    disabled={!frameworkInput.trim()}
                                >
                                    <span className={styles.plusIcon}>+</span>
                                </button>
                            </div>
                            {formData.requiredFrameworks.length > 0 && (
                                <div className={styles.tagsContainer}>
                                    {formData.requiredFrameworks.map((framework, index) => (
                                        <span key={index} className={styles.tag}>
                                            {framework}
                                            <button
                                                type="button"
                                                onClick={() => removeFramework(framework)}
                                                className={styles.removeTag}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
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
                                    Salaire minimum (TND)
                                </label>
                                <input
                                    type="number"
                                    id="salaryMin"
                                    name="salaryMin"
                                    value={formData.salaryMin}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Ex: 45000"
                                    min="0"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="salaryMax" className={styles.label}>
                                    Salaire maximum (TND)
                                </label>
                                <input
                                    type="number"
                                    id="salaryMax"
                                    name="salaryMax"
                                    value={formData.salaryMax}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Ex: 65000"
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
                                <option value="closed">Fermée</option>
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
                                {loading ? 'Modification...' : 'Enregistrer les modifications'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditOffer;