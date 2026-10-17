import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const DASHBOARDS = {
  'vadgaon-sheri': {
    name: 'Pune-208 Vadgaon Sheri',
    subtitle: 'Vadgaon Sheri Constituency Campaign Segments',
    segments: [
      "NIRGUDI", "VADAGAON SHINDE", "LOHGAON", "DHANORI", "KALAS",
      "YERAVADA", "VIMAN NAGAR", "VADGAON SHERI", "KHARADI", "MANJRI KHURD TALERAN WADI"
    ]
  },
  'kasba-peth': {
    name: 'Pune-215 Kasba Peth',
    subtitle: 'Kasba Peth Constituency Campaign Segments',
    segments: [
      "KASBA PETH", "BUDHWAR PETH", "SHANIWAR PETH", "NARAYAN PETH",
      "SADASHIV PETH", "RASTA PETH", "NAVI SADASHIV PETH", "RAVIVAR PETH",
      "GANESH PETH", "BHAVANI PETH", "SHUKRAWAR PETH", "SENADATTA PETH",
      "DATTAWADI", "M. PHULE PETH", "GURUWAR PETH", "GHORPADE PETH", "DANDEKAR POOL"
    ]
  }
};

export default function CampaignDashboard() {
  const { dashboardId } = useParams();
  const navigate = useNavigate();
  const cleanId = dashboardId?.toLowerCase();

  const dashboard = DASHBOARDS[cleanId];

  useEffect(() => {
    if (!dashboard) {
      navigate('/services/campaign');
      return;
    }

    // Access Control check
    if (sessionStorage.getItem('access_' + cleanId) !== 'true') {
      navigate(`/constituency-login/${cleanId}`);
    }
  }, [cleanId, dashboard]);

  if (!dashboard) return null;

  return (
    <>
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>{dashboard.name}</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            {dashboard.subtitle}
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="district-page-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', justifyContent: 'center', maxWidth: '1000px', margin: '0 auto' }}>
            {dashboard.segments.map((segment, index) => (
              <Link 
                key={index} 
                to={`/voters-list?segment=${encodeURIComponent(segment)}`} 
                className="district-btn-large" 
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', padding: '1.25rem' }}
              >
                {index + 1}. {segment}
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/services/campaign" className="btn" style={{ background: '#f1f5f9', color: 'var(--text-main)', textDecoration: 'none' }}>
              &larr; Back to Campaigns
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
