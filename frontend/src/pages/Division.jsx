import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Division() {
  const { divisionId } = useParams();

  const divisionMap = {
    pune: {
      name: 'Pune Division',
      districts: [
        { id: 'pune', name: 'Pune' },
        { id: 'satara', name: 'Satara' },
        { id: 'sangli', name: 'Sangli' },
        { id: 'kolhapur', name: 'Kolhapur' },
        { id: 'solapur', name: 'Solapur' }
      ]
    },
    nashik: {
      name: 'Nashik Division',
      districts: [
        { id: 'nashik', name: 'Nashik' },
        { id: 'dhule', name: 'Dhule' },
        { id: 'jalgaon', name: 'Jalgaon' },
        { id: 'nandurbar', name: 'Nandurbar' },
        { id: 'ahmednagar', name: 'Ahmednagar' }
      ]
    },
    konkan: {
      name: 'Konkan Division',
      districts: [
        { id: 'mumbai-city', name: 'Mumbai City' },
        { id: 'mumbai-suburban', name: 'Mumbai Suburban' },
        { id: 'thane', name: 'Thane' },
        { id: 'palghar', name: 'Palghar' },
        { id: 'raigad', name: 'Raigad' },
        { id: 'ratnagiri', name: 'Ratnagiri' },
        { id: 'sindhudurg', name: 'Sindhudurg' }
      ]
    },
    nagpur: {
      name: 'Nagpur Division',
      districts: [
        { id: 'nagpur', name: 'Nagpur' },
        { id: 'wardha', name: 'Wardha' },
        { id: 'bhandara', name: 'Bhandara' },
        { id: 'gondia', name: 'Gondia' },
        { id: 'chandrapur', name: 'Chandrapur' },
        { id: 'gadchiroli', name: 'Gadchiroli' }
      ]
    },
    aurangabad: {
      name: 'Aurangabad Division',
      districts: [
        { id: 'aurangabad', name: 'Aurangabad' },
        { id: 'jalna', name: 'Jalna' },
        { id: 'parbhani', name: 'Parbhani' },
        { id: 'hingoli', name: 'Hingoli' },
        { id: 'nanded', name: 'Nanded' },
        { id: 'beed', name: 'Beed' },
        { id: 'latur', name: 'Latur' },
        { id: 'osmanabad', name: 'Osmanabad' }
      ]
    },
    amravati: {
      name: 'Amravati Division',
      districts: [
        { id: 'amravati', name: 'Amravati' },
        { id: 'buldhana', name: 'Buldhana' },
        { id: 'akola', name: 'Akola' },
        { id: 'washim', name: 'Washim' },
        { id: 'yavatmal', name: 'Yavatmal' }
      ]
    }
  };

  const division = divisionMap[divisionId?.toLowerCase()];

  if (!division) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Division Not Found</h2>
        <p>Please select a valid administrative division.</p>
        <Link to="/maharashtra" className="btn btn-primary" style={{ textDecoration: 'none' }}>Go back</Link>
      </div>
    );
  }

  return (
    <>
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>{division.name}</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            Administrative Districts of {division.name}
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>Select a District</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem', color: 'var(--text-muted)' }}>
            View detailed analytical insights, polling data, and demographic summaries for the corresponding district.
          </p>

          <div className="district-page-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', justifyContent: 'center', maxWidth: '900px', margin: '0 auto' }}>
            {division.districts.map((dist) => (
              <Link key={dist.id} to={`/district/${dist.id}`} className="district-btn-large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', padding: '1.25rem' }}>
                {dist.name}
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/maharashtra" className="btn" style={{ background: '#f1f5f9', color: 'var(--text-main)', textDecoration: 'none' }}>
              &larr; Back to Divisions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
