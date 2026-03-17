import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Header from '../components/Header';
import styles from '../Styles/OrganizationDashboard.module.css';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

// API functions

//requette GET
//Récupérer les offres d'une organisation depuis backend (axios)


async function getOrganizationOffers(query = '') {                  //Paramètre par défaut si aucun query n'est passé
    const response = await axios.get('/organization/offers', {      // Requête HTTP avec Axios
        params: { q: query }
    });
    return response.data;                                           // Les vraies données sont dans response.data
}

//Récupérer les recherches de candidats (axios)

async function getCandidateSearches() {
    const response = await axios.get('/organization/searches');     //Envoie une requête GET au backend
    return response.data;
}

//Supprimer une offre
//requette DELETE
async function deleteOffer(offerId) {
    const response = await axios.delete(`/organization/offers/${offerId}`);     //Envoie une requête DELETE au backend
    return response.data;
}



const OrganizationDashboard = () => {
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [searches, setSearches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const [activeTab, setActiveTab] = useState('offers'); // 'offers' or 'searches'
    const [searchQuery, setSearchQuery] = useState(''); // Search state
    const [searchHistory, setSearchHistory] = useState([]); // Search history state
    const [deletingOffer, setDeletingOffer] = useState(null);

    // Load history from localStorage on mount
    //charge l'historique de recherche
    useEffect(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {                                           //true → Exécute le code (GetItem a retourné quelque chose)
            setSearchHistory(JSON.parse(savedHistory));
        }
    }, []);



//sauvegarde automatiquement l'historique de recherche
    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));       //'clé', 'valeur'
    }, [searchHistory]);


// charge toutes les données du dashboard depuis le backend (offre+search)
    const loadDashboardData = useCallback(async (query = '') => {                   //Hook qui mémorise la fonction pour éviter de la recréer
        try {
            const [offersData, searchesData] = await Promise.all([                  //Exécute plusieurs requêtes en parallèle
                //depuis le backend on a:
                getOrganizationOffers(query),
                getCandidateSearches()
            ]);
            setOffers(offersData);
            setSearches(searchesData);
            setError(null);
        } catch (err) {
            setError("Impossible de charger les données.");
            console.error('Erreur de chargement:', err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);



    // Initial load
    // vérifie l'authentification de l'utilisateur et charge les données du dashboard
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');   //Récupère l'utilisateur sauvegardé  //Convertit le texte en objet JavaScript
        const accessToken = localStorage.getItem('accessToken');        //Récupère le token d'authentification

        if (accessToken && user._id) {                                  //Les DEUX conditions doivent être vraies
            setLoading(true); 
            loadDashboardData();                                        //Charge les offres et recherches depuis l'API
        } else {
            setLoading(false);
        }
    }, [navigate, loadDashboardData]);


    //recherche avec délai
    // Debounced search effect
    useEffect(() => {
        const timerId = setTimeout(() => {
            if (activeTab === 'offers') {
                // Trigger search
                loadDashboardData(searchQuery);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timerId);
    }, [searchQuery, activeTab, loadDashboardData]);


//Affiche un message de succès ou d'erreur pendant 3 secondes
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };


//Déconnecte l'utilisateur en nettoyant le token et les données
    const handleLogout = async () => {
        try {
            await axios.post('/auth/logout');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            navigate('/login');                                 //edirige vers /login
        } catch (err) {
            console.error('Logout error:', err);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };


    const handleDeleteOffer = (offer) => {
        setDeletingOffer(offer);
    };

    const handleConfirmDeleteOffer = async () => {
        if (!deletingOffer) return;

        try {
            await deleteOffer(deletingOffer._id);
            setOffers((prev) => prev.filter((offer) => offer._id !== deletingOffer._id));
            showNotification('✓ Offre supprimée avec succès !');
        } catch (err) {
            showNotification('✗ Erreur lors de la suppression', 'error');
            console.error('Erreur de suppression:', err);
        } finally {
            setDeletingOffer(null);
        }
    };

// redirige l'utilisateur vers la page de 'création' puis 'modification' d'une nouvelle offre d'emploi.
    const handleCreateOffer = () => {
        navigate('/organization/create-offer');
    };


    const handleEditOffer = (offerId) => {
        navigate(`/organization/edit-offer/${offerId}`);
    };



    const getStatusBadge = (status) => {
        const badges = {
            active: { text: 'Active', color: '#10b981' },
            closed: { text: 'Fermée', color: '#ef4444' },
            draft: { text: 'Brouillon', color: '#f59e0b' }
        };
        const badge = badges[status] || badges.draft;
        return (
            <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                backgroundColor: `${badge.color}20`,
                color: badge.color,
                fontSize: '0.875rem',
                fontWeight: '500'
            }}>
                {badge.text}
            </span>
        );
    };

    // History Management
    // ajoute le terme de recherche à l'historique
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            const newItem = searchQuery.trim();
            setSearchHistory(prev => {
                const filtered = prev.filter(item => item !== newItem);
                return [newItem, ...filtered].slice(0, 5); // Keep last 5 unique items    
            });
        }
    };

//remplit automatiquement la barre de recherche quand l'utilisateur clique sur un terme de l'historique.
    const handleHistoryClick = (term) => {          //terme de recherche cliqué
        setSearchQuery(term);                          //pour mettre à jour l'état 
    };


//supprime un terme spécifique de l'historique de recherche
    const handleDeleteHistoryItem = (e, term) => {          //Objet événement du clic sur le bouton ×
        e.stopPropagation();
        setSearchHistory(prev => prev.filter(item => item !== term));
    };


//Supprime UN terme spécifique de l'historique quand l'utilisateur clique sur le bouton × 
    const handleClearHistory = () => {
        setSearchHistory([]);
    };

//préparent les données filtrées pour l'affichage 
// Use offers directly as they are now filtered by backend
    const filteredOffers = offers;

    const filteredSearches = searches.filter(search => {        //Crée un nouveau tableau contenant uniquement les recherches qui satisfont la condition.
        if (!searchQuery.trim()) return true;                   //Si la barre de recherche est vide, garde toutes les recherches.
        const query = searchQuery.toLowerCase();                //Convertit la recherche en minuscules
        return (
            search.searchName?.toLowerCase().includes(query) ||
            search.criteria?.toLowerCase().includes(query)
        );
    });


    return (
        <div className="app-container">
            <Header />

            <main className={styles.dashboard}>
                <div className={styles.dashboardHeader}>
                    <div>
                        <h2 className={styles.dashboardTitle}>Tableau de bord Organisation</h2>
                        <p className={styles.dashboardSubtitle}>
                            Gérez vos offres d'emploi et recherchez des candidats qualifiés
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className={styles.statsContainer}>
                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.developers}`}>
                            📋
                        </div>
                        <div className={styles.statInfo}>
                            <h3>{offers.length}</h3>
                            <p>Offres créées</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.developers}`}>
                            🔍
                        </div>
                        <div className={styles.statInfo}>
                            <h3>{searches.length}</h3>
                            <p>Recherches de candidats</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={`${styles.statIcon} ${styles.developers}`}>
                            ✅
                        </div>
                        <div className={styles.statInfo}>
                            <h3>{offers.filter(o => o.status === 'active').length}</h3>
                            <p>Offres actives</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'offers' ? styles.active : ''}`}
                        onClick={() => setActiveTab('offers')}
                    >
                        📋 Mes Offres d'Emploi
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'searches' ? styles.active : ''}`}
                        onClick={() => setActiveTab('searches')}
                    >
                        🔍 Recherches de Candidats
                    </button>
                </div>

                {/* Search Bar */}
                <div className={styles.searchBarContainer}>
                    <div className={styles.searchBar}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder={activeTab === 'offers' ?
                                'Rechercher une offre (titre, compétences, localisation...)' :
                                'Rechercher une recherche de candidat...'
                            }
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className={styles.searchInput}
                        />
                        {searchQuery && (
                            <button
                                className={styles.clearBtn}
                                onClick={() => setSearchQuery('')}
                                title="Effacer la recherche"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Search History */}
                    {searchHistory.length > 0 && (
                        <div className={styles.historyContainer}>
                            <div className={styles.historyHeader}>
                                <span className={styles.historyTitle}>🕒 Recherches récentes</span>
                                <button className={styles.clearHistoryBtn} onClick={handleClearHistory}>Tout effacer</button>
                            </div>
                            <div className={styles.historyTags}>
                                {searchHistory.map((term, index) => (
                                    <div
                                        key={index}
                                        className={styles.historyTag}
                                        onClick={() => handleHistoryClick(term)}
                                    >
                                        <span>{term}</span>
                                        <button
                                            className={styles.deleteTagBtn}
                                            onClick={(e) => handleDeleteHistoryItem(e, term)}
                                            title="Supprimer de l'historique"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {searchQuery && (
                        <p className={styles.searchResults}>
                            {activeTab === 'offers'
                                ? `${filteredOffers.length} offre${filteredOffers.length !== 1 ? 's' : ''} trouvée${filteredOffers.length !== 1 ? 's' : ''}`
                                : `${filteredSearches.length} recherche${filteredSearches.length !== 1 ? 's' : ''} trouvée${filteredSearches.length !== 1 ? 's' : ''}`
                            }
                        </p>
                    )}
                </div>

                {loading && (
                    <div className={styles.loading}>
                        ⏳ Chargement des données...
                    </div>
                )}

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Offers Tab */}
                        {activeTab === 'offers' && (
                            <div className={styles.contentSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>Liste des Offres d'Emploi</h3>
                                    <button
                                        className={styles.createBtn}
                                        onClick={handleCreateOffer}
                                    >
                                        ➕ Créer une Nouvelle Offre
                                    </button>
                                </div>

                                {filteredOffers.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <p>📭 Aucune offre d'emploi créée pour le moment.</p>
                                        <button
                                            className={styles.createBtn}
                                            onClick={handleCreateOffer}
                                        >
                                            Créer votre première offre
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.offersGrid}>
                                        {filteredOffers.map((offer) => (
                                            <div key={offer._id} className={styles.offerCard} onClick={() => navigate(`/organization/applicants/${offer._id}`)}>
                                                <div className={styles.offerHeader}>
                                                    <h4>{offer.title}</h4>
                                                    {getStatusBadge(offer.status)}
                                                </div>

                                                <p className={styles.offerDescription}>
                                                    {offer.description.substring(0, 150)}
                                                    {offer.description.length > 150 ? '...' : ''}
                                                </p>

                                                <div className={styles.offerDetails}>
                                                    {offer.contractType && (
                                                        <span className={styles.detailBadge}>
                                                            💼 {offer.contractType}
                                                        </span>
                                                    )}
                                                    {offer.experienceLevel && (
                                                        <span className={styles.detailBadge}>
                                                            ⭐ {offer.experienceLevel}
                                                        </span>
                                                    )}
                                                    {offer.preferredLocalisation && (
                                                        <span className={styles.detailBadge}>
                                                            📍 {offer.preferredLocalisation}
                                                        </span>
                                                    )}
                                                </div>

                                                {offer.requiredSkills && offer.requiredSkills.length > 0 && (
                                                    <div className={styles.skillTags}>
                                                        {offer.requiredSkills.slice(0, 3).map((skill, idx) => (
                                                            <span key={idx} className={styles.skillTag}>
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {offer.requiredSkills.length > 3 && (
                                                            <span className={styles.skillTag}>
                                                                +{offer.requiredSkills.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className={styles.offerActions}>
                                                    <button
                                                        className={styles.editBtn}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditOffer(offer._id)
                                                        }}
                                                    >
                                                        ✏️ Modifier
                                                    </button>
                                                    <button
                                                        className={styles.deleteBtn}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteOffer(offer)
                                                        }}
                                                    >
                                                        🗑️ Supprimer
                                                    </button>
                                                </div>

                                                <div className={styles.offerFooter}>
                                                    <small>Créée le {new Date(offer.createdAt).toLocaleDateString('fr-FR')}</small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Searches Tab */}
                        {activeTab === 'searches' && (
                            <div className={styles.contentSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>Recherches de Candidats</h3>
                                </div>

                                {filteredSearches.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <p>🔍 Aucune recherche de candidats enregistrée.</p>
                                    </div>
                                ) : (
                                    <div className={styles.searchesList}>
                                        {filteredSearches.map((search, idx) => (
                                            <div key={idx} className={styles.searchCard}>
                                                <h4>{search.searchName || `Recherche ${idx + 1}`}</h4>
                                                <p>Critères: {search.criteria}</p>
                                                <small>Date: {new Date(search.createdAt).toLocaleDateString('fr-FR')}</small>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>

            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            {deletingOffer && (
                <DeleteConfirmModal
                    developer={{ name: deletingOffer.title }}
                    onConfirm={handleConfirmDeleteOffer}
                    onClose={() => setDeletingOffer(null)}
                />
            )}
        </div>
    );
};

export default OrganizationDashboard;
