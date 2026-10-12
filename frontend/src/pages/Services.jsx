import React from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <>
      {/* Page Header */}
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>Our Services</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            Comprehensive, state-of-the-art solutions tailored to elevate your organizational impact.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-gray" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="grid grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Service 1 */}
            <div className="card animate-on-scroll" style={{ opacity: 1, transform: 'none', textAlign: 'left' }}>
              <div className="card-icon"><i className="fa-solid fa-code"></i></div>
              <h3>Software Development</h3>
              <p>End-to-end software development, from web and mobile apps to complex enterprise systems, designed specifically for your operational needs.</p>
              <Link to="/services/software" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>
                Learn More &rarr;
              </Link>
            </div>
            {/* Service 2 */}
            <div className="card animate-on-scroll" style={{ opacity: 1, transform: 'none', textAlign: 'left' }}>
              <div className="card-icon"><i className="fa-solid fa-chart-pie"></i></div>
              <h3>Political Data Analytics</h3>
              <p>Deep-dive data analysis mapping out voter trends, sentiment analysis, and demographic breakdowns to guide your campaign strategy.</p>
              <Link to="/services/analytics" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>
                Learn More &rarr;
              </Link>
            </div>
            {/* Service 3 */}
            <div className="card animate-on-scroll" style={{ opacity: 1, transform: 'none', textAlign: 'left' }}>
              <div className="card-icon"><i className="fa-solid fa-bullhorn"></i></div>
              <h3>Campaign Management</h3>
              <p>Comprehensive digital and physical management strategies for political entities, ensuring precise outreach and messaging resonance.</p>
              <Link to="/services/campaign" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>
                Learn More &rarr;
              </Link>
            </div>
            {/* Service 4 */}
            <div className="card animate-on-scroll" style={{ opacity: 1, transform: 'none', textAlign: 'left' }}>
              <div className="card-icon"><i className="fa-solid fa-clipboard-list"></i></div>
              <h3>Political Surveys</h3>
              <p>Methodological surveys covering critical regions and localized groups, delivering real-time pulse reading for dynamic campaign shifts.</p>
              <Link to="/services/surveys" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>
                Learn More &rarr;
              </Link>
            </div>
            {/* Service 5 */}
            <div className="card animate-on-scroll" style={{ opacity: 1, transform: 'none', textAlign: 'left' }}>
              <div className="card-icon"><i className="fa-solid fa-users-viewfinder"></i></div>
              <h3>Corporate Training</h3>
              <p>Modernize your workforce with specialized training modules focusing on data literacy, cutting-edge corporate tools, and agile practices.</p>
              <Link to="/services/training" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>
                Learn More &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
