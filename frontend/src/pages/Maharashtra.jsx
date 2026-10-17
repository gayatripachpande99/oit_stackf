import React from 'react';
import { Link } from 'react-router-dom';

export default function Maharashtra() {
  const divisions = [
    { id: 'nashik', name: 'Nashik Division' },
    { id: 'konkan', name: 'Konkan Division' },
    { id: 'pune', name: 'Pune Division' },
    { id: 'nagpur', name: 'Nagpur Division' },
    { id: 'aurangabad', name: 'Aurangabad Division' },
    { id: 'amravati', name: 'Amravati Division' }
  ];

  return (
    <>
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>Maharashtra State</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            Administrative Divisions of Maharashtra
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '3rem' }}>Select a Division</h2>
          
          <div className="grid-3x2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            {divisions.map((div) => (
              <Link key={div.id} to={`/division/${div.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="division-card" style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s' }}>
                  <div className="division-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)' }}>{div.name}</h5>
                    <i className="fa-solid fa-arrow-right division-icon" style={{ color: 'var(--brand)', transition: 'transform 0.3s' }}></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/services/analytics" className="btn" style={{ background: '#f1f5f9', color: 'var(--text-main)', textDecoration: 'none' }}>
              &larr; Back to Analytics
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
