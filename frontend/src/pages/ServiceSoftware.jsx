import React from 'react';
import { Link } from 'react-router-dom';

export default function ServiceSoftware() {
  return (
    <>
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>Software Development</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            Custom enterprise solutions engineered to scale seamlessly across operations.
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', textAlign: 'left' }}>
          <div className="service-detail-content" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '3rem' }}>
            
            {/* Main Content */}
            <div className="service-main animate-on-scroll" style={{ opacity: 1 }}>
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop" 
                alt="Software Development" 
                style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}
              />

              <h2 style={{ color: 'var(--primary)', marginTop: '2rem', fontSize: '1.8rem', fontWeight: 700 }}>Overview</h2>
              <p style={{ lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                Every organization has unique workflows that off-the-shelf software simply cannot handle. Our Software Development service focuses on mapping your specific operational bottlenecks and building bespoke digital solutions — from specialized web applications to complex enterprise integrations.
              </p>
              <p style={{ lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                We employ agile methodologies to ensure rapid delivery, high adaptability to changing requirements, and zero disruptions during organizational digital transformations.
              </p>

              <h3 style={{ color: 'var(--primary)', marginTop: '2rem', fontSize: '1.5rem', fontWeight: 600 }}>Key Benefits</h3>
              <ul className="benefits-list" style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#00bfff' }}></i> 
                  <span><strong>Total Customization:</strong> Features designed strictly around your specific workflows.</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#00bfff' }}></i> 
                  <span><strong>Scalability & Security:</strong> Built with enterprise-grade architecture for massive datasets.</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#00bfff' }}></i> 
                  <span><strong>Cross-platform Ecosystems:</strong> Seamless integration across web, mobile, and legacy systems.</span>
                </li>
                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#00bfff' }}></i> 
                  <span><strong>Long-term Support:</strong> Continuous maintenance, feature updates, and technical consulting.</span>
                </li>
              </ul>

              <h3 style={{ color: 'var(--primary)', marginTop: '2rem', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Technologies We Use</h3>
              <div className="tech-stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div className="tech-item"><i className="fa-brands fa-react" style={{ color: '#61DAFB' }}></i> React</div>
                <div className="tech-item"><i className="fa-brands fa-node-js" style={{ color: '#339933' }}></i> Node.js</div>
                <div className="tech-item"><i className="fa-brands fa-java" style={{ color: '#f89820' }}></i> Java</div>
                <div className="tech-item"><i className="fa-solid fa-server" style={{ color: '#007396' }}></i> Azure DevOps</div>
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
                    <Link to="/services/software" className="active" style={{ textDecoration: 'none', color: 'var(--brand)', fontWeight: 600 }}>Software Development</Link>
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
