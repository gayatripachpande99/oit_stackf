import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container hero-content animate-on-scroll" style={{ opacity: 1, transform: 'none' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'white' }}>Our Services</h1>
        <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.85)', maxWidth: '800px', margin: '0 auto 3rem' }}>
          Empowering your business with cutting-edge software, political data analytics, and corporate training.
        </p>
        <div className="hero-btns" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/services/software" className="btn btn-outline" style={{ color: 'white', borderColor: 'white', textDecoration: 'none' }}>
            <i className="fa-solid fa-code"></i> Software Development
          </Link>
          <Link to="/services/analytics" className="btn btn-outline" style={{ color: 'white', borderColor: 'white', textDecoration: 'none' }}>
            <i className="fa-solid fa-chart-line"></i> Data Analytics
          </Link>
          <Link to="/services/campaign" className="btn btn-outline" style={{ color: 'white', borderColor: 'white', textDecoration: 'none' }}>
            <i className="fa-solid fa-bullhorn"></i> Campaign Management
          </Link>
          <Link to="/services/training" className="btn btn-outline" style={{ color: 'white', borderColor: 'white', textDecoration: 'none' }}>
            <i className="fa-solid fa-users-viewfinder"></i> Corporate Training
          </Link>
          <Link to="/services/surveys" className="btn btn-outline" style={{ color: 'white', borderColor: 'white', textDecoration: 'none' }}>
            <i className="fa-solid fa-square-poll-vertical"></i> Political Surveys
          </Link>
        </div>
      </div>
    </section>
  );
}
