import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="services-hero">
      <div className="hero-bg-overlay">
        <img src="/hero-globe.png" alt="" className="hero-art-left" aria-hidden="true" />
        <img src="/hero-waves.png" alt="" className="hero-art-right" aria-hidden="true" />
      </div>

      <div className="container hero-center-content animate-on-scroll">
        <h1 className="services-title">
          Our <span className="cyan-gradient-text">Services</span>
        </h1>
        <div className="cyan-accent-bar"></div>

        <div className="services-pills-container">
          <div className="services-pill-row row-top">
            <Link to="/services/software" className="service-pill-btn">
              <i className="fa-solid fa-code pill-icon"></i>
              <span>Software Development</span>
            </Link>
            <Link to="/services/analytics" className="service-pill-btn">
              <i className="fa-solid fa-chart-line pill-icon"></i>
              <span>Data Analytics</span>
            </Link>
            <Link to="/services/campaign" className="service-pill-btn">
              <i className="fa-solid fa-bullhorn pill-icon"></i>
              <span>Campaign Management</span>
            </Link>
          </div>

          <div className="services-pill-row row-bottom">
            <Link to="/services/training" className="service-pill-btn">
              <i className="fa-solid fa-users-viewfinder pill-icon"></i>
              <span>Corporate Training</span>
            </Link>
            <Link to="/services/surveys" className="service-pill-btn">
              <i className="fa-solid fa-square-poll-vertical pill-icon"></i>
              <span>Political Surveys</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
