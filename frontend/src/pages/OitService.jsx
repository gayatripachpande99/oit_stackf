import React, { useEffect, useState } from 'react';

export default function OitService() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Dynamic CSS injection
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = 'oit-service-css';
    link.href = '/oit-service.css';
    document.head.appendChild(link);

    // Change body style
    document.body.style.backgroundColor = '#0A192F';
    document.body.style.color = '#CCD6F6';

    return () => {
      const existingLink = document.getElementById('oit-service-css');
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
      // Reset body style
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("OIT Stack Inquiry:", formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="oit-service-landing-page" style={{ textAlign: 'left' }}>
      
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-glow"></div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', lineHeight: 1.2 }}>
          Transform Data Into <span style={{ color: 'var(--accent)' }}>Smart Business Decisions</span> 🚀
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 2.5rem', color: 'var(--text)' }}>
          Unlock the hidden potential of your data with our enterprise-grade analytics, scalable software architecture, and AI-driven solutions. Powering the next generation of fast, intelligent businesses.
        </p>
        <div className="hero-btns" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="#contact" className="btn btn-primary" style={{ textDecoration: 'none' }}>Get Free Consultation</a>
          <a href="#services" className="btn btn-secondary" style={{ textDecoration: 'none' }}>View Services</a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: '6rem 5%' }}>
        <div className="section-head" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>
            Our Premium <span style={{ color: 'var(--accent)' }}>Services</span>
          </h2>
          <p style={{ color: 'var(--text)', maxWidth: '600px', margin: '0 auto' }}>
            Cutting-edge solutions explicitly engineered for modern tech scalability and intelligence.
          </p>
        </div>

        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Service 1 */}
          <div className="glass-card">
            <i className="fa-solid fa-chart-pie service-icon" style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1.5rem', display: 'block' }}></i>
            <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1rem' }}>Advanced Analytics</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
              Turn raw numbers into actionable visual strategies that accelerate business growth and predictability.
            </p>
            <ul className="service-list" style={{ padding: 0 }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}><i className="fa-solid fa-check" style={{ color: 'var(--accent)' }}></i> Predictive Modeling</li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}><i className="fa-solid fa-check" style={{ color: 'var(--accent)' }}></i> Big Data Processing</li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}><i className="fa-solid fa-check" style={{ color: 'var(--accent)' }}></i> Real-time Tracking</li>
            </ul>
          </div>

          {/* Service 2 */}
          <div className="glass-card">
            <i className="fa-solid fa-code service-icon" style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1.5rem', display: 'block' }}></i>
            <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1rem' }}>Custom Software</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
              Future-proof application development leveraging the latest tech stack architectures.
            </p>
            <ul className="service-list" style={{ padding: 0 }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}><i className="fa-solid fa-check" style={{ color: 'var(--accent)' }}></i> Cloud Native Apps</li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}><i className="fa-solid fa-check" style={{ color: 'var(--accent)' }}></i> Scalable Microservices</li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}><i className="fa-solid fa-check" style={{ color: 'var(--accent)' }}></i> High-performance APIs</li>
            </ul>
          </div>

          {/* Service 3 */}
          <div className="glass-card">
            <i className="fa-solid fa-brain service-icon" style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1.5rem', display: 'block' }}></i>
            <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1rem' }}>AI Solutions</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
              Automate processes and uncover hidden insights using advanced machine learning models.
            </p>
            <ul className="service-list" style={{ padding: 0 }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}><i className="fa-solid fa-check" style={{ color: 'var(--accent)' }}></i> Automated Workflows</li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}><i className="fa-solid fa-check" style={{ color: 'var(--accent)' }}></i> NLP & Chatbots</li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}><i className="fa-solid fa-check" style={{ color: 'var(--accent)' }}></i> Deep Learning</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" style={{ padding: '6rem 5%', background: 'rgba(17,34,64,0.3)' }}>
        <div className="section-head" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'white' }}>How It <span style={{ color: 'var(--accent)' }}>Works</span></h2>
          <p style={{ color: 'var(--text)' }}>Our systematic operational methodology ensures flawless project lifecycle delivery.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem', fontWeight: 'bold' }}>01</div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Data Gathering</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>Ingest, clean, and organize raw operational logs or regional demographics.</p>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem', fontWeight: 'bold' }}>02</div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Analytical Modeling</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>Process details via advanced statistical routines and machine learning engines.</p>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem', fontWeight: 'bold' }}>03</div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Scalable Launch</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>Deploy clean dashboards or bespoke apps ready for enterprise production.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '6rem 5%', maxWidth: '800px', margin: '0 auto' }}>
        <div className="section-head" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'white' }}>Let's <span style={{ color: 'var(--accent)' }}>Talk</span></h2>
          <p style={{ color: 'var(--text)' }}>Request a consultation with our technology and data strategy experts.</p>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          {submitted && (
            <div style={{ background: '#0f5132', color: '#d1e7dd', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
              Consultation request received successfully! We will contact you soon.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem', fontWeight: 600 }}>Your Name</label>
              <input 
                type="text" required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(10,25,47,0.5)', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem', fontWeight: 600 }}>Your Email</label>
              <input 
                type="email" required value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(10,25,47,0.5)', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: 'white', marginBottom: '0.5rem', fontWeight: 600 }}>Project Details</label>
              <textarea 
                rows="4" required value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(10,25,47,0.5)', color: 'white', resize: 'vertical' }}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', border: 'none', borderRadius: '30px' }}>
              Send Message &rarr;
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
