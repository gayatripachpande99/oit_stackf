import React from 'react';
import { Link } from 'react-router-dom';

export default function ServiceTraining() {
  return (
    <>
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>Corporate Training</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            Empower your workforce with specialized data, coding, and agile corporate training.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="service-detail-content" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '3rem', textAlign: 'left' }}>
            
            {/* Main Content */}
            <div className="service-main animate-on-scroll" style={{ opacity: 1 }}>
              <div 
                className="training-section" 
                style={{ 
                  position: 'relative',
                  background: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop') center/cover", 
                  borderRadius: '24px', 
                  padding: '4rem 2rem', 
                  color: 'white',
                  overflow: 'hidden',
                  marginBottom: '3rem',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                }}
              >
                {/* Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)', zIndex: 1 }}></div>
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div className="heading" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', margin: '0 0 10px' }}>
                      Ready to Start <span style={{ color: '#2fd3ff' }}>Training?</span>
                    </h2>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9, color: 'white' }}>Launch our corporate training portal to access assessments and learning plans.</p>
                  </div>

                  <div className="cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div className="card" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
                      <div className="icon blue" style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifycontent: 'center', flexShrink: 0, fontSize: '1.25rem', justifyContent: 'center' }}>
                        <i className="fa-solid fa-clipboard-check"></i>
                      </div>
                      <div className="card-content">
                        <h3 style={{ fontSize: '1.1rem', color: 'white', margin: '0 0 4px', fontWeight: 700 }}>Aptitude Tests</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Test your analytical skills</p>
                      </div>
                    </div>

                    <div className="card" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
                      <div className="icon green" style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifycontent: 'center', flexShrink: 0, fontSize: '1.25rem', justifyContent: 'center' }}>
                        <i className="fa-solid fa-code"></i>
                      </div>
                      <div className="card-content">
                        <h3 style={{ fontSize: '1.1rem', color: 'white', margin: '0 0 4px', fontWeight: 700 }}>Coding Challenges</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Solve real-world problems</p>
                      </div>
                    </div>

                    <div className="card" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
                      <div className="icon purple" style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifycontent: 'center', flexShrink: 0, fontSize: '1.25rem', justifyContent: 'center' }}>
                        <i className="fa-solid fa-user-tie"></i>
                      </div>
                      <div className="card-content">
                        <h3 style={{ fontSize: '1.1rem', color: 'white', margin: '0 0 4px', fontWeight: 700 }}>Mock Interviews</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Practice and build confidence</p>
                      </div>
                    </div>
                  </div>

                  <div className="card leaderboard" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'white', maxWidth: '380px', margin: '0 auto 2.5rem' }}>
                    <div className="icon gold" style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fef3c7', color: '#f59e0b', display: 'flex', alignItems: 'center', justifycontent: 'center', flexShrink: 0, fontSize: '1.25rem', justifyContent: 'center' }}>
                      <i className="fa-solid fa-trophy"></i>
                    </div>
                    <div className="card-content" style={{ textAlign: 'left' }}>
                      <h3 style={{ fontSize: '1.1rem', color: 'white', margin: '0 0 4px', fontWeight: 700 }}>Leaderboard</h3>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>See how you rank</p>
                    </div>
                  </div>

                  <div className="launch-btn" style={{ display: 'flex', justifyContent: 'center' }}>
                    <a href="/training/login.html" className="btn btn-primary" style={{ padding: '1rem 3rem', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(90deg, #5145ff, #18d4ff)', border: 'none', boxShadow: '0 10px 20px rgba(81,69,255,0.3)' }}>
                      <i className="fa-solid fa-rocket"></i> Launch Training Portal
                    </a>
                  </div>
                </div>
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
                    <Link to="/services/surveys" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>Political Surveys</Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link to="/services/training" className="active" style={{ textDecoration: 'none', color: 'var(--brand)', fontWeight: 600 }}>Corporate Training</Link>
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
