import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Header from '../components/Header';
import styles from '../Styles/Home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    contractType: '',
    experienceLevel: '',
    localisation: ''
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, offers]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/offers');
      setOffers(response.data);
      setFilteredOffers(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des offres');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = offers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.requiredSkills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Contract type filter
    if (filters.contractType) {
      filtered = filtered.filter(offer => offer.contractType === filters.contractType);
    }

    // Experience level filter
    if (filters.experienceLevel) {
      filtered = filtered.filter(offer => offer.experienceLevel === filters.experienceLevel);
    }

    // Location filter
    if (filters.localisation) {
      filtered = filtered.filter(offer =>
        offer.preferredLocalisation.toLowerCase().includes(filters.localisation.toLowerCase())
      );
    }

    setFilteredOffers(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      contractType: '',
      experienceLevel: '',
      localisation: ''
    });
    setSearchTerm('');
  };

  const handleOfferClick = (offerId) => {
    navigate(`/offers/${offerId}`);
  };

  const getContractTypeLabel = (type) => {
    const labels = {
      'CDI': 'CDI',
      'CDD': 'CDD',
      'freelance': 'Freelance',
      'stage': 'Stage'
    };
    return labels[type] || type;
  };

  const getExperienceLevelLabel = (level) => {
    const labels = {
      'junior': 'Junior',
      'intermediate': 'Intermédiaire',
      'senior': 'Senior',
      'expert': 'Expert'
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Chargement des offres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      
      <main className={styles.homeContainer}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Trouvez votre prochain défi</h1>
          <p className={styles.heroSubtitle}>
            {offers.length} offres d'emploi pour développeurs
          </p>
        </div>

        {/* Search and Filters */}
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Rechercher par titre, compétences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filtersRow}>
            <select
              value={filters.contractType}
              onChange={(e) => handleFilterChange('contractType', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Tous les contrats</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="freelance">Freelance</option>
              <option value="stage">Stage</option>
            </select>

            <select
              value={filters.experienceLevel}
              onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Tous les niveaux</option>
              <option value="junior">Junior</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="senior">Senior</option>
              <option value="expert">Expert</option>
            </select>

            <input
              type="text"
              placeholder="Localisation"
              value={filters.localisation}
              onChange={(e) => handleFilterChange('localisation', e.target.value)}
              className={styles.filterInput}
            />

            {(searchTerm || filters.contractType || filters.experienceLevel || filters.localisation) && (
              <button onClick={clearFilters} className={styles.clearBtn}>
                ✕ Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className={styles.resultsCount}>
          {filteredOffers.length} {filteredOffers.length === 1 ? 'offre trouvée' : 'offres trouvées'}
        </div>

        {/* Offers Grid */}
        {error && <div className={styles.error}>{error}</div>}
        
        {!error && filteredOffers.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3>Aucune offre trouvée</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        )}

        {!error && filteredOffers.length > 0 && (
          <div className={styles.offersGrid}>
            {filteredOffers.map((offer) => (
              <div
                key={offer._id}
                className={styles.offerCard}
                onClick={() => handleOfferClick(offer._id)}
              >
                <div className={styles.offerHeader}>
                  <h3 className={styles.offerTitle}>{offer.title}</h3>
                  <span className={`${styles.contractBadge} ${styles[offer.contractType]}`}>
                    {getContractTypeLabel(offer.contractType)}
                  </span>
                </div>

                <div className={styles.offerCompany}>
                  🏢 {offer.organizationName || 'Organisation'}
                </div>

                <p className={styles.offerDescription}>
                  {offer.description.substring(0, 150)}...
                </p>

                <div className={styles.offerSkills}>
                  {offer.requiredSkills.slice(0, 4).map((skill, index) => (
                    <span key={index} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                  {offer.requiredSkills.length > 4 && (
                    <span className={styles.skillTag}>
                      +{offer.requiredSkills.length - 4}
                    </span>
                  )}
                </div>

                <div className={styles.offerFooter}>
                  <div className={styles.offerInfo}>
                    <span className={styles.infoItem}>
                      📍 {offer.preferredLocalisation || 'Non spécifié'}
                    </span>
                    <span className={styles.infoItem}>
                      💼 {getExperienceLevelLabel(offer.experienceLevel)}
                    </span>
                  </div>
                  {offer.salary && offer.salary.min && (
                    <div className={styles.offerSalary}>
                      💰 {offer.salary.min} - {offer.salary.max} TND
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;