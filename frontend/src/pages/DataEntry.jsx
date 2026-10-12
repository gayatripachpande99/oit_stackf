import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DataEntry() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [form, setForm] = useState({
    id: null, // used for editing
    candidate_name: '',
    constituency_id: '',
    constituency_name: '',
    party: '',
    sex: 'M',
    age: '',
    category: 'GEN',
    symbol: '',
    general: '',
    postal: '',
    year: '2024',
    rank_no: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  // Authenticate Access
  useEffect(() => {
    const userStr = localStorage.getItem("oit_logged_in_user");
    const dataEntryAccess = sessionStorage.getItem("data_entry_access");

    if (!userStr || dataEntryAccess !== "true") {
      navigate('/login?redirect=/data-entry');
      return;
    }
    
    fetchEntries();
  }, []);

  const getBaseUrl = () => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? "http://localhost:3000"
      : "https://oit-stack-backend.onrender.com";
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${getBaseUrl()}/api/data-entries`);
      if (!res.ok) throw new Error("Failed to fetch entries");
      const data = await res.json();
      setEntries(data.data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load entries from database.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      candidate_name: '',
      constituency_id: '',
      constituency_name: '',
      party: '',
      sex: 'M',
      age: '',
      category: 'GEN',
      symbol: '',
      general: '',
      postal: '',
      year: '2024',
      rank_no: ''
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Pre-calculate values
    const generalVotes = parseInt(form.general) || 0;
    const postalVotes = parseInt(form.postal) || 0;
    const totalVotes = generalVotes + postalVotes;

    const payload = {
      candidate_name: form.candidate_name,
      constituency_id: parseInt(form.constituency_id),
      constituency_name: form.constituency_name,
      party: form.party.toUpperCase(),
      sex: form.sex,
      age: parseInt(form.age) || null,
      category: form.category,
      symbol: form.symbol,
      general: generalVotes,
      postal: postalVotes,
      total: totalVotes,
      year: parseInt(form.year),
      rank_no: parseInt(form.rank_no) || null
    };

    try {
      let res;
      if (isEditing) {
        res = await fetch(`${getBaseUrl()}/api/data-entries/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${getBaseUrl()}/api/data-entries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) throw new Error("Failed to save entry");
      const result = await res.json();

      setSuccessMsg(isEditing ? "Record updated successfully!" : "Record added successfully!");
      resetForm();
      fetchEntries();
      
      // Auto-hide success message
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save record to the database.");
    }
  };

  const handleEdit = (entry) => {
    setForm({
      id: entry._id,
      candidate_name: entry.candidate_name || '',
      constituency_id: entry.constituency_id || '',
      constituency_name: entry.constituency_name || '',
      party: entry.party || '',
      sex: entry.sex || 'M',
      age: entry.age || '',
      category: entry.category || 'GEN',
      symbol: entry.symbol || '',
      general: entry.general || '',
      postal: entry.postal || '',
      year: entry.year || '2024',
      rank_no: entry.rank_no || ''
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${getBaseUrl()}/api/data-entries/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Failed to delete record");
      setSuccessMsg("Record deleted successfully.");
      fetchEntries();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete record.");
    }
  };

  return (
    <>
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>Data Entry Portal</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            MongoDB CRUD panel for administrative employees
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'left' }}>
          
          {errorMsg && (
            <div style={{ padding: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
              <i className="fa-solid fa-triangle-exclamation"></i> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ padding: '1rem', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
              <i className="fa-solid fa-circle-check"></i> {successMsg}
            </div>
          )}

          {/* Form Section */}
          <div className="card" style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '3rem' }}>
            <h3 style={{ margin: '0 0 2rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
              {isEditing ? "Edit Candidate Entry" : "Create New Candidate Entry"}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Candidate Name</label>
                <input 
                  type="text" required value={form.candidate_name} 
                  onChange={(e) => setForm({ ...form, candidate_name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Constituency ID</label>
                <input 
                  type="number" required value={form.constituency_id} 
                  onChange={(e) => setForm({ ...form, constituency_id: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Constituency Name</label>
                <input 
                  type="text" required value={form.constituency_name} 
                  onChange={(e) => setForm({ ...form, constituency_name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Party Code</label>
                <input 
                  type="text" required value={form.party} 
                  onChange={(e) => setForm({ ...form, party: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)' }}
                  placeholder="e.g. BJP, INC, NCP"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Gender</label>
                <select 
                  value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white' }}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Age</label>
                <input 
                  type="number" required value={form.age} 
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Category</label>
                <select 
                  value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white' }}
                >
                  <option value="GEN">General</option>
                  <option value="SC">Scheduled Caste</option>
                  <option value="ST">Scheduled Tribe</option>
                  <option value="OBC">Other Backward Class</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Symbol</label>
                <input 
                  type="text" value={form.symbol} 
                  onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>General Votes</label>
                <input 
                  type="number" required value={form.general} 
                  onChange={(e) => setForm({ ...form, general: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Postal Votes</label>
                <input 
                  type="number" required value={form.postal} 
                  onChange={(e) => setForm({ ...form, postal: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Election Year</label>
                <select 
                  value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'white' }}
                >
                  <option value="2009">2009</option>
                  <option value="2014">2014</option>
                  <option value="2019">2019</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Rank Number</label>
                <input 
                  type="number" required value={form.rank_no} 
                  onChange={(e) => setForm({ ...form, rank_no: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--border)' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', border: 'none', borderRadius: '30px' }}>
                  {isEditing ? "Update Record" : "Add Record"}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="btn" style={{ padding: '0.8rem 2rem', background: '#cbd5e1', color: 'var(--text-main)', border: 'none', borderRadius: '30px' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Database Entries Table */}
          <div className="card" style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>MongoDB Records</h3>
              <button onClick={fetchEntries} className="btn" style={{ padding: '0.5rem 1.25rem', border: '1px solid var(--border)', borderRadius: '30px', background: '#f8fafc', cursor: 'pointer' }}>
                <i className="fa-solid fa-arrows-rotate"></i> Refresh Table
              </button>
            </div>

            {loading ? (
              <p>Loading database entries...</p>
            ) : entries.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No candidate records found in database.</p>
            ) : (
              <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <table className="candidate-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th>Year</th>
                      <th>Constituency</th>
                      <th>Candidate</th>
                      <th>Party</th>
                      <th>Votes</th>
                      <th>Rank</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.8rem' }}><strong>{entry.year || '-'}</strong></td>
                        <td style={{ padding: '0.8rem' }}>{entry.constituency_name || '-'} ({entry.constituency_id || '-'})</td>
                        <td style={{ padding: '0.8rem' }}><strong>{entry.candidate_name || '-'}</strong></td>
                        <td style={{ padding: '0.8rem' }}><span className="party-badge">{entry.party || '-'}</span></td>
                        <td style={{ padding: '0.8rem' }}>{(entry.total || 0).toLocaleString()}</td>
                        <td style={{ padding: '0.8rem' }}><span className="rank-badge">{entry.rank_no || '-'}</span></td>
                        <td style={{ padding: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEdit(entry)} className="btn" style={{ padding: '0.4rem 0.8rem', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                            <i className="fa-solid fa-pen-to-square"></i> Edit
                          </button>
                          <button onClick={() => handleDelete(entry._id)} className="btn" style={{ padding: '0.4rem 0.8rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                            <i className="fa-solid fa-trash-can"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
