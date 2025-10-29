import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>🚀 DevOnDeck</h1>
        <p> CONNECT . BUILD . LAUNCH </p>
        <div className="cta-buttons">
          <Link to="/login" className="btn btn-primary">
            Se connecter
          </Link>
          <Link to="/register" className="btn btn-secondary">
            S'inscrire
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;