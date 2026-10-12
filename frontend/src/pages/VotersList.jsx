import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const kasbaSegmentsList = [
  "KASBA PETH", "BUDHWAR PETH", "SHANIWAR PETH", "NARAYAN PETH", 
  "SADASHIV PETH", "RASTA PETH", "NAVI SADASHIV PETH", "RAVIVAR PETH", 
  "GANESH PETH", "BHAVANI PETH", "SHUKRAWAR PETH", "SENADATTA PETH", 
  "DATTAWADI", "M. PHULE PETH", "GURUWAR PETH", "GHORPADE PETH", "DANDEKAR POOL"
];

const boothMapping = {
  "NIRGUDI": [1],
  "VADAGAON SHINDE": [2, 3, 4],
  "LOHGAON": [
    ...Array.from({ length: 45 }, (_, i) => i + 5),
    ...Array.from({ length: 8 }, (_, i) => i + 86)
  ],
  "DHANORI": [
    ...Array.from({ length: 18 }, (_, i) => i + 50),
    ...Array.from({ length: 15 }, (_, i) => i + 71),
    ...Array.from({ length: 16 }, (_, i) => i + 118)
  ],
  "KALAS": [
    ...Array.from({ length: 3 }, (_, i) => i + 68),
    ...Array.from({ length: 11 }, (_, i) => i + 94)
  ],
  "YERAVADA": [
    ...Array.from({ length: 13 }, (_, i) => i + 105),
    ...Array.from({ length: 43 }, (_, i) => i + 134),
    ...Array.from({ length: 27 }, (_, i) => i + 192),
    ...Array.from({ length: 59 }, (_, i) => i + 270),
    ...Array.from({ length: 33 }, (_, i) => i + 343)
  ],
  "VIMAN NAGAR": [
    ...Array.from({ length: 15 }, (_, i) => i + 177)
  ],
  "VADGAON SHERI": [
    ...Array.from({ length: 8 }, (_, i) => i + 219),
    ...Array.from({ length: 5 }, (_, i) => i + 255),
    ...Array.from({ length: 8 }, (_, i) => i + 262),
    ...Array.from({ length: 14 }, (_, i) => i + 329),
    ...Array.from({ length: 10 }, (_, i) => i + 376),
    ...Array.from({ length: 18 }, (_, i) => i + 415)
  ],
  "KHARADI": [
    ...Array.from({ length: 28 }, (_, i) => i + 227),
    ...Array.from({ length: 2 }, (_, i) => i + 260),
    ...Array.from({ length: 29 }, (_, i) => i + 386)
  ],
  "MANJRI KHURD TALERAN WADI": [
    ...Array.from({ length: 5 }, (_, i) => i + 433)
  ],
  "KASBA PETH": [
    ...Array.from({ length: 14 }, (_, i) => i + 1),
    ...Array.from({ length: 6 }, (_, i) => i + 52)
  ],
  "BUDHWAR PETH": [
    ...Array.from({ length: 2 }, (_, i) => i + 15),
    ...Array.from({ length: 5 }, (_, i) => i + 47),
    ...Array.from({ length: 9 }, (_, i) => i + 68),
    ...Array.from({ length: 3 }, (_, i) => i + 102)
  ],
  "SHANIWAR PETH": [
    ...Array.from({ length: 14 }, (_, i) => i + 17),
    ...Array.from({ length: 3 }, (_, i) => i + 44)
  ],
  "NARAYAN PETH": [
    ...Array.from({ length: 5 }, (_, i) => i + 31),
    ...Array.from({ length: 4 }, (_, i) => i + 40)
  ],
  "SADASHIV PETH": [
    ...Array.from({ length: 4 }, (_, i) => i + 36),
    ...Array.from({ length: 9 }, (_, i) => i + 77),
    ...Array.from({ length: 14 }, (_, i) => i + 88),
    ...Array.from({ length: 4 }, (_, i) => i + 143),
    ...Array.from({ length: 10 }, (_, i) => i + 162)
  ],
  "RASTA PETH": [
    ...Array.from({ length: 10 }, (_, i) => i + 58)
  ],
  "NAVI SADASHIV PETH": [
    ...Array.from({ length: 2 }, (_, i) => i + 86)
  ],
  "RAVIVAR PETH": [
    ...Array.from({ length: 3 }, (_, i) => i + 105),
    ...Array.from({ length: 11 }, (_, i) => i + 121),
    ...Array.from({ length: 2 }, (_, i) => i + 188)
  ],
  "GANESH PETH": [
    ...Array.from({ length: 4 }, (_, i) => i + 108),
    ...Array.from({ length: 6 }, (_, i) => i + 115),
    ...Array.from({ length: 2 }, (_, i) => i + 184)
  ],
  "BHAVANI PETH": [
    ...Array.from({ length: 3 }, (_, i) => i + 112),
    ...Array.from({ length: 20 }, (_, i) => i + 194),
    ...Array.from({ length: 2 }, (_, i) => i + 234)
  ],
  "SHUKRAWAR PETH": [
    ...Array.from({ length: 11 }, (_, i) => i + 132),
    ...Array.from({ length: 12 }, (_, i) => i + 172)
  ],
  "SENADATTA PETH": [
    ...Array.from({ length: 8 }, (_, i) => i + 147)
  ],
  "DATTAWADI": [
    ...Array.from({ length: 7 }, (_, i) => i + 155)
  ],
  "M. PHULE PETH": [
    ...Array.from({ length: 2 }, (_, i) => i + 186),
    ...Array.from({ length: 20 }, (_, i) => i + 214),
    249
  ],
  "GURUWAR PETH": [
    ...Array.from({ length: 4 }, (_, i) => i + 190),
    ...Array.from({ length: 9 }, (_, i) => i + 250)
  ],
  "GHORPADE PETH": [
    ...Array.from({ length: 13 }, (_, i) => i + 236),
    ...Array.from({ length: 6 }, (_, i) => i + 263)
  ],
  "DANDEKAR POOL": [
    ...Array.from({ length: 4 }, (_, i) => i + 259)
  ]
};

export default function VotersList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const segment = decodeURIComponent(searchParams.get('segment') || '').trim().replace(/\s+/g, ' ').toUpperCase();
  
  const [boothNum, setBoothNum] = useState('');
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentBooths = boothMapping[segment] || [];

  const backLink = kasbaSegmentsList.includes(segment) 
    ? '/dashboard/kasba-peth' 
    : '/dashboard/vadgaon-sheri';

  const fetchVoters = async (selectedBooth = '') => {
    setLoading(true);
    const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? "http://localhost:3000"
      : "https://oit-stack-backend.onrender.com";

    try {
      let fetchUrl = `${BASE_URL}/api/voters`;
      const params = [];
      if (segment) {
        params.push(`segment=${encodeURIComponent(segment)}`);
      }
      if (selectedBooth) {
        params.push(`boothNumber=${encodeURIComponent(selectedBooth)}`);
      }
      if (params.length > 0) {
        fetchUrl += `?${params.join("&")}`;
      }

      console.log("Fetching voters from:", fetchUrl);
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error("Failed to fetch voters");
      const result = await res.json();
      setVoters(result.data || []);
      setError('');
    } catch (err) {
      console.error("Error fetching voters:", err);
      setError("Failed to load voter registry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoters(boothNum);
  }, [segment, boothNum]);

  const handleBoothChange = (e) => {
    setBoothNum(e.target.value);
  };

  return (
    <>
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>Voters Registry</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            Voters List for {segment || 'Segment'}
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 id="segment-title" style={{ color: 'var(--primary)', margin: 0, fontSize: '1.6rem', fontWeight: 700 }}>
              {segment ? `Voters List: ${segment}` : 'Voters List'}
            </h2>
            <Link to={backLink} className="btn back-btn" style={{ background: '#f1f5f9', color: 'var(--text-main)', textDecoration: 'none', padding: '0.6rem 1.5rem', borderRadius: '30px' }}>
              &larr; Back to Dashboard
            </Link>
          </div>

          <div className="table-responsive" style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <table className="voters-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ minWidth: '180px' }}>
                    <div className="booth-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>BOOTH NUMBER</span>
                      <select 
                        value={boothNum} 
                        onChange={handleBoothChange}
                        className="booth-dropdown"
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1.5px solid var(--border)', background: 'white', outline: 'none' }}
                      >
                        <option value="">All</option>
                        {currentBooths.map(b => (
                          <option key={b} value={b}>Booth {b}</option>
                        ))}
                      </select>
                    </div>
                  </th>
                  <th>SR NUMBER</th>
                  <th>NAME</th>
                  <th>AGE</th>
                  <th>GENDER</th>
                </tr>
              </thead>
              <tbody id="tableBody">
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
                      <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Fetching voters...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'red' }}>
                      {error}
                    </td>
                  </tr>
                ) : voters.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No voter records found for this selection.
                    </td>
                  </tr>
                ) : (
                  voters.map((v, index) => {
                    const gender = (v.gender || v.sex || '').toUpperCase();
                    let genderClass = 'gender-other';
                    let genderIcon = null;

                    if (gender.startsWith('M')) {
                      genderClass = 'gender-male';
                      genderIcon = <i className="fa-solid fa-mars" style={{ color: '#3b82f6' }}></i>;
                    } else if (gender.startsWith('F')) {
                      genderClass = 'gender-female';
                      genderIcon = <i className="fa-solid fa-venus" style={{ color: '#ec4899' }}></i>;
                    }

                    return (
                      <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem' }}><strong>Booth {v.boothNumber || v.booth || '-'}</strong></td>
                        <td style={{ padding: '1rem' }}>{v.srNumber || v.serialNumber || v.sr_no || '-'}</td>
                        <td style={{ padding: '1rem' }}><strong>{v.name || v.voter_name || v.candidate_name || '-'}</strong></td>
                        <td style={{ padding: '1rem' }}>{v.age || '-'}</td>
                        <td style={{ padding: '1rem' }}>
                          <span className={`gender-badge ${genderClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {genderIcon} {v.gender || v.sex || '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
