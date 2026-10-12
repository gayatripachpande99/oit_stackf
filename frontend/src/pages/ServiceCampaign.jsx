import React from 'react';
import { Link } from 'react-router-dom';

export default function ServiceCampaign() {
  return (
    <>
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>Campaign Management</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            End-to-end guidance and operations for successful political endeavors.
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'left' }}>
          <div className="service-detail-content" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '3rem' }}>
            
            {/* Main Content */}
            <div className="service-main animate-on-scroll" style={{ opacity: 1 }}>
              <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 700 }}>Overview</h2>
              <p style={{ lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '2rem' }}>
                We guide campaign committees from initial strategy blueprints to ground-level field deployment and real-time operations dashboarding. We coordinate messaging alignment, digital presence, voter targeting list generation, and booth-level worker communication.
              </p>

              <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}>Campaign Constituencies</h2>
              <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem', color: 'var(--text-muted)' }}>
                Select a constituency to manage and track campaign progress, voter analytics, and field operations.
              </p>
              
              <div className="district-page-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', justifyContent: 'center', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                <Link to="/constituency-login/vadgaon-sheri" className="district-btn-large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', padding: '1.25rem' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: '#00bfff', marginRight: '8px' }}></i> Pune-208 Vadgaon Sheri
                </Link>
                <Link to="/constituency-login/kasba-peth" className="district-btn-large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', padding: '1.25rem' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: '#00bfff', marginRight: '8px' }}></i> Pune-215 Kasba Peth
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="service-sidebar animate-on-scroll" style={{ opacity: 1 }}>
              <div className="widget" style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--brand)', paddingBottom: '0.5rem', display: 'inline-block' }}>
                  All Services
                </h3>
                <ul className="service-list" style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link to="/services/software" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>Software Development</Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link to="/services/analytics" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>Political Data Analytics</Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link to="/services/campaign" className="active" style={{ textDecoration: 'none', color: 'var(--brand)', fontWeight: 600 }}>Campaign Management</Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link to="/services/surveys" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>Political Surveys</Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link to="/services/training" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>Corporate Training</Link>
                  </li>
                </ul>
              </div>

              <div className="widget" style={{ background: 'var(--gradient-accent)', color: 'white', border: 'none', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '1rem' }}>Ready to Transform?</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '1.8rem', fontSize: '1.05rem', lineHeight: 1.5 }}>
                  Contact us today to discuss how our solutions can elevate your success.
                </p>
                <Link to="/contact" className="btn" style={{ width: '100%', background: 'white', color: 'var(--accent)', fontWeight: 700, borderRadius: '12px', fontSize: '1.1rem', padding: '0.75rem', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                  Request Service
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
