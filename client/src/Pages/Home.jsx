import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Header from '../components/Header';
import styles from '../Styles/Home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    contractType: '',
    experienceLevel: ''
  });


  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/offers');
      setOffers(response.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des offres');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = !searchTerm || 
      offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.requiredSkills?.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesContract = !filters.contractType || 
      offer.contractType === filters.contractType;

    const matchesExperience = !filters.experienceLevel || 
      offer.experienceLevel === filters.experienceLevel;

    return matchesSearch && matchesContract && matchesExperience;
  });

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
        {/* Hero Section - Full Width */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Trouvez votre prochain défi</h1>
            </div>
          </div>
        </div>

        {/* Main Content - Constrained Width */}
        <div className={styles.mainContent}>
          {/* Search Section */}
          <div className={`${styles.searchSection} animate-content`}>
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
            </div>
          </div>

          {/* Offers Section */}
          <section className={`${styles.offersSection} animate-section`}>
            <h2 className={styles.sectionTitle}>
              {filteredOffers.length} offre{filteredOffers.length > 1 ? 's' : ''} disponible{filteredOffers.length > 1 ? 's' : ''}
            </h2>
            
            {error ? (
              <div className={styles.errorState}>
                <p>⚠️ {error}</p>
                <button onClick={fetchOffers} className={styles.retryButton}>
                  Réessayer
                </button>
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📭</div>
                <p>Aucune offre trouvée</p>
                {(searchTerm || filters.contractType || filters.experienceLevel) && (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ contractType: '', experienceLevel: '' });
                    }}
                    className={styles.clearFiltersButton}
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.offersGrid}>
                {filteredOffers.map((offer, index) => (
                  <div
                    key={offer._id}
                    className={`${styles.offerCard} stagger-item`}
                    style={{ animationDelay: `${0.1 * (index % 6)}s` }}
                    onClick={() => handleOfferClick(offer._id)}
                  >
                    <div className={styles.offerHeader}>
                      <h3 className={styles.offerTitle}>{offer.title}</h3>
                      <span className={`${styles.contractBadge} ${styles[offer.contractType]}`}>
                        {getContractTypeLabel(offer.contractType)}
                      </span>
                    </div>

                    <div className={styles.offerCompany}>
                      🏢 {offer.organizationId?.name || 'Organisation'}
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
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;