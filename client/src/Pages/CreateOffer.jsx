//formulaire de création d'offre d'emploi pour les organisations.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Header from '../components/Header';
import styles from '../Styles/CreateOffer.module.css';

const CreateOffer = () => {
    const navigate = useNavigate();                     //Hook de navigation
    const [loading, setLoading] = useState(false);      //Gère l'état de chargement pendant l'envoi du formulaire
    const [error, setError] = useState(null);           //Stocke les messages d'erreur
    const [success, setSuccess] = useState(false);      // Indique si la création a réussi
//L'état du formulaire
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

//des états temporaires qui stockent le texte que l'utilisateur tape avant de l'ajouter à la liste finale.
    const [skillInput, setSkillInput] = useState('');
    const [frameworkInput, setFrameworkInput] = useState('');


//Une fonction qui met à jour formData quand l'utilisateur tape dans un champ du formulaire.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

//Une fonction qui ajoute une compétence à la liste requiredSkills après validation.
    const addSkill = () => {                                                               //Vérifie que la compétence n'est pas déjà dans la liste 
        if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {  //Vérifie que l'input n'est pas vide.
            setFormData(prev => ({                                            //Mise à jour fonctionnelle avec accès à l'état précéden
                ...prev,
                requiredSkills: [...prev.requiredSkills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };


//Une fonction qui supprime une compétence spécifique de la liste requiredSkills.
    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({                          //Mise à jour fonctionnelle avec accès à l'état précédent.
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };


//Une fonction qui ajoute un framework/technologie à la liste
    const addFramework = () => {                                                                        //Vérifie que le framework n'est pas déjà dans la liste
        if (frameworkInput.trim() && !formData.requiredFrameworks.includes(frameworkInput.trim())) {    //Vérifie que l'input n'est pas vide.
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
            // Prepare data
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
                                    placeholder="Ex: JavaScript, Python, SQL..."
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
                                                aria-label="Supprimer"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <small className={styles.hint}>Appuyez sur Enter ou cliquez sur + pour ajouter</small>
                        </div>

                        {/* Frameworks */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Frameworks/Technologies
                            </label>
                            <div className={styles.tagInputWrapper}>
                                <input
                                    type="text"
                                    value={frameworkInput}
                                    onChange={(e) => setFrameworkInput(e.target.value)}
                                    onKeyPress={handleFrameworkKeyPress}
                                    className={styles.tagInput}
                                    placeholder="Ex: React, Node.js, MongoDB..."
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
                                                aria-label="Supprimer"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <small className={styles.hint}>Appuyez sur Enter ou cliquez sur + pour ajouter</small>
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
