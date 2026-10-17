import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { districtData } from '../constituencies';

export default function District() {
  const { districtId } = useParams();
  const navigate = useNavigate();

  const district = districtData[districtId?.toLowerCase()];

  // Map district IDs to their division page
  const divisionMap = {
    nandurbar: "nashik", dhule: "nashik", jalgaon: "nashik", nashik: "nashik", ahmednagar: "nashik",
    buldhana: "amravati", akola: "amravati", washim: "amravati", amravati: "amravati", yavatmal: "amravati",
    wardha: "nagpur", nagpur: "nagpur", bhandara: "nagpur", gondia: "nagpur", gadchiroli: "nagpur", chandrapur: "nagpur",
    aurangabad: "aurangabad", jalna: "aurangabad", parbhani: "aurangabad", hingoli: "aurangabad", nanded: "aurangabad", beed: "aurangabad", latur: "aurangabad", osmanabad: "aurangabad",
    "mumbai-city": "konkan", "mumbai-suburban": "konkan", thane: "konkan", palghar: "konkan", raigad: "konkan", ratnagiri: "konkan", sindhudurg: "konkan",
    pune: "pune", satara: "pune", sangli: "pune", solapur: "pune", kolhapur: "pune"
  };

  const divisionName = divisionMap[districtId?.toLowerCase()] || "maharashtra";

  if (!district) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>District Not Found</h2>
        <p>Please select a valid district from the divisions page.</p>
        <Link to="/maharashtra" className="btn btn-primary" style={{ textDecoration: 'none' }}>Go to Divisions</Link>
      </div>
    );
  }

  const handleConstituencyClick = (assembly) => {
    // Extract ID, e.g. "1 - Akkalkuwa (ST)" -> "1"
    const idMatch = assembly.match(/^(\d+)\s*-/);
    if (idMatch) {
      const constituencyId = idMatch[1];
      navigate(`/constituency/${constituencyId}?name=${encodeURIComponent(assembly)}`);
    }
  };

  return (
    <>
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>{district.name} District</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            Assembly Constituencies of {district.name}
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>Select an Assembly Constituency</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem', color: 'var(--text-muted)' }}>
            View detailed analytical insights, polling data, and demographic summaries for the corresponding assembly constituency.
          </p>

          <div className="district-page-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', justifyContent: 'center', maxWidth: '1000px', margin: '0 auto' }}>
            {district.assemblies.map((assembly, index) => (
              <button 
                key={index} 
                className="district-btn-large constituency-btn" 
                onClick={() => handleConstituencyClick(assembly)}
                style={{ cursor: 'pointer', border: '1px solid var(--border)', background: '#ffffff', outline: 'none' }}
              >
                {assembly}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to={`/division/${divisionName}`} className="btn" style={{ background: '#f1f5f9', color: 'var(--text-main)', textDecoration: 'none' }}>
              &larr; Back to {divisionName.charAt(0).toUpperCase() + divisionName.slice(1)} Division
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
