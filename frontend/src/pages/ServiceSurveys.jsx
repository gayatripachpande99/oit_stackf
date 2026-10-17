import React from 'react';
import { Link } from 'react-router-dom';

export default function ServiceSurveys() {
  return (
    <>
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1579389083046-d3ce21621f4d?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>Political Surveys</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            Methodological surveys delivering real-time pulse reading for dynamic campaign shifts.
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', textAlign: 'left' }}>
          <div className="service-detail-content" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '3rem' }}>
            
            {/* Main Content */}
            <div className="service-main animate-on-scroll" style={{ opacity: 1 }}>
              <img 
                src="https://images.unsplash.com/photo-1579389083046-d3ce21621f4d?q=80&w=2070&auto=format&fit=crop" 
                alt="Political Surveys" 
                style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}
              />

              <h2 style={{ color: 'var(--primary)', marginTop: '2rem', fontSize: '1.8rem', fontWeight: 700 }}>Overview</h2>
              <p style={{ lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                Surveys and polling are only as effective as their methodologies. We deploy hyper-localized physical, telephonic, and digital polling systems to accurately gather voter demographics without inherent bias. Our systems filter out anomalies, resulting in the most accurate ground-level intelligence available.
              </p>
              <p style={{ lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                This service serves as the core pipeline fueling our digital analytics mapping. It measures candidate favorability over time, sentiment shifts based on recent news, and opposition effectiveness.
              </p>

              <h3 style={{ color: 'var(--primary)', marginTop: '2rem', fontSize: '1.5rem', fontWeight: 600 }}>Key Benefits</h3>
              <ul className="benefits-list" style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#00bfff' }}></i> 
                  <span><strong>Low Margin of Error:</strong> Statistically robust randomized local sampling techniques.</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#00bfff' }}></i> 
                  <span><strong>Rapid Turnaround:</strong> Deploy critical issue flash-surveys and get results within 24 hours.</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#00bfff' }}></i> 
                  <span><strong>Multilingual Polling:</strong> Localized language teams resulting in higher geographical accuracy.</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#00bfff' }}></i> 
                  <span><strong>Custom Segmenting:</strong> Filter polling responses rapidly by age, geography, and socio-economic bracket.</span>
                </li>
              </ul>

              <h3 style={{ color: 'var(--primary)', marginTop: '2rem', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Technologies We Use</h3>
              <div className="tech-stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div className="tech-item"><i className="fa-solid fa-square-poll-horizontal" style={{ color: '#00BFFF' }}></i> Qualtrics</div>
                <div className="tech-item"><i className="fa-solid fa-mobile-screen" style={{ color: '#112240' }}></i> Twilio IVR</div>
                <div className="tech-item"><i className="fa-solid fa-map-location-dot" style={{ color: '#0F9D58' }}></i> ArcGIS</div>
                <div className="tech-item"><i className="fa-solid fa-database" style={{ color: '#336791' }}></i> SQL</div>
                <div className="tech-item"><i className="fa-solid fa-chart-pie" style={{ color: '#005A9E' }}></i> PowerBI</div>
                <div className="tech-item"><i className="fa-solid fa-brain" style={{ color: '#FF6F00' }}></i> TensorFlow</div>
                <div className="tech-item"><i className="fa-brands fa-aws" style={{ color: '#FF9900' }}></i> AWS Analytics</div>
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
                    <Link to="/services/campaign" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>Campaign Management</Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link to="/services/surveys" className="active" style={{ textDecoration: 'none', color: 'var(--brand)', fontWeight: 600 }}>Political Surveys</Link>
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
