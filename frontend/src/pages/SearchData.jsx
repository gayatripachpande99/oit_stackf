import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchData() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Geolocation & photo uploading
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [viewPhotoModalOpen, setViewPhotoModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Authenticate Access
  useEffect(() => {
    const userStr = localStorage.getItem("oit_logged_in_user");
    const searchAccess = sessionStorage.getItem("search_data_access");

    if (!userStr || searchAccess !== "true") {
      navigate('/login?redirect=/search-data');
      return;
    }
    
    fetchEntries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEntries(entries);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = entries.filter(e => 
        (e.candidate_name || '').toLowerCase().includes(q) ||
        (e.constituency_name || '').toLowerCase().includes(q) ||
        (e.party || '').toLowerCase().includes(q)
      );
      setFilteredEntries(filtered);
    }
  }, [searchQuery, entries]);

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
      setFilteredEntries(data.data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load search data entries.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      fetchGpsLocation();
    };
    reader.readAsDataURL(file);
  };

  const fetchGpsLocation = () => {
    setGpsLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation not supported by browser.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString()
        });
        setGpsLoading(false);
      },
      (error) => {
        console.error(error);
        alert("GPS access denied or unavailable.");
        setGpsLocation({ latitude: null, longitude: null, timestamp: new Date().toISOString() });
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const saveGpsPhoto = async () => {
    if (!photoPreview || !selectedEntry) return;

    try {
      const res = await fetch(`${getBaseUrl()}/api/data-entries/${selectedEntry._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedEntry,
          gps_photo: photoPreview,
          gps_location: gpsLocation || {}
        })
      });

      if (!res.ok) throw new Error("Upload failed");
      setSuccessMsg("GPS photo saved successfully!");
      setPhotoModalOpen(false);
      setPhotoPreview(null);
      setGpsLocation(null);
      fetchEntries();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert("Error saving GPS photo.");
    }
  };

  return (
    <>
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>Search Data Portal</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            Location-tagged voter roll verification
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

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              placeholder="Search entries by candidate, party or constituency..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flexGrow: 1, padding: '0.8rem 1.25rem', borderRadius: '30px', border: '1.5px solid var(--border)', fontSize: '1rem' }}
            />
            <button onClick={fetchEntries} className="btn btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '30px' }}>
              Refresh
            </button>
          </div>

          <div className="card" style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 700 }}>Database Search Results</h3>

            {loading ? (
              <p>Loading database data...</p>
            ) : filteredEntries.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No matching entries found.</p>
            ) : (
              <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <table className="candidate-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th>Year</th>
                      <th>Constituency</th>
                      <th>Candidate</th>
                      <th>Party</th>
                      <th>Total Votes</th>
                      <th>GPS Mapping</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry) => (
                      <tr key={entry._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.8rem' }}><strong>{entry.year || '-'}</strong></td>
                        <td style={{ padding: '0.8rem' }}>{entry.constituency_name || '-'}</td>
                        <td style={{ padding: '0.8rem' }}><strong>{entry.candidate_name || '-'}</strong></td>
                        <td style={{ padding: '0.8rem' }}><span className="party-badge">{entry.party || '-'}</span></td>
                        <td style={{ padding: '0.8rem' }}>{(entry.total || 0).toLocaleString()}</td>
                        <td style={{ padding: '0.8rem' }}>
                          {entry.gps_location?.latitude ? (
                            <span style={{ color: '#2e7d32', fontWeight: 600 }}>
                              📍 Linked ({entry.gps_location.latitude.toFixed(4)}, {entry.gps_location.longitude.toFixed(4)})
                            </span>
                          ) : (
                            <span style={{ color: '#d32f2f', fontWeight: 600 }}>Unmapped</span>
                          )}
                        </td>
                        <td style={{ padding: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => { setSelectedEntry(entry); setPhotoModalOpen(true); }}
                            className="btn" 
                            style={{ padding: '0.4rem 0.8rem', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}
                          >
                            <i className="fa-solid fa-camera"></i> Tag GPS Photo
                          </button>
                          {entry.gps_photo && (
                            <button 
                              onClick={() => { setSelectedEntry(entry); setViewPhotoModalOpen(true); }}
                              className="btn" 
                              style={{ padding: '0.4rem 0.8rem', background: '#f0fdf4', color: '#16a34a', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                              <i className="fa-solid fa-image"></i> View GPS Info
                            </button>
                          )}
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

      {/* Upload Photo Modal */}
      {photoModalOpen && selectedEntry && (
        <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '500px', margin: '10% auto', borderRadius: '16px', background: 'white', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Tag GPS Photo: {selectedEntry.candidate_name}</h3>
              <span onClick={() => { setPhotoModalOpen(false); setPhotoPreview(null); }} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>&times;</span>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Select Photo</label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} />
            </div>

            {gpsLoading && <p>Detecting GPS location coordinates...</p>}

            {gpsLocation && (
              <div style={{ padding: '1rem', background: '#f1f5f9', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <p style={{ margin: '0 0 5px', fontWeight: 600 }}>GPS Tag Details:</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  {gpsLocation.latitude ? `Coordinates: ${gpsLocation.latitude.toFixed(6)}, ${gpsLocation.longitude.toFixed(6)}` : "GPS Access Denied/Unavailable"}
                </p>
              </div>
            )}

            {photoPreview && (
              <img src={photoPreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', marginBottom: '1.5rem' }} />
            )}

            <button 
              disabled={!photoPreview || gpsLoading} 
              onClick={saveGpsPhoto}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.8rem', border: 'none', borderRadius: '8px' }}
            >
              Upload & Save
            </button>
          </div>
        </div>
      )}

      {/* View Photo Modal */}
      {viewPhotoModalOpen && selectedEntry && (
        <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '500px', margin: '10% auto', borderRadius: '16px', background: 'white', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Tagged GPS Photo info</h3>
              <span onClick={() => setViewPhotoModalOpen(false)} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>&times;</span>
            </div>
            
            <img src={selectedEntry.gps_photo} alt="GPS tagged" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', marginBottom: '1.5rem' }} />
            
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem' }}>
              <p style={{ margin: '0 0 5px' }}><strong>Candidate:</strong> {selectedEntry.candidate_name}</p>
              <p style={{ margin: '0 0 5px' }}><strong>Latitude:</strong> {selectedEntry.gps_location?.latitude || '-'}</p>
              <p style={{ margin: '0 0 5px' }}><strong>Longitude:</strong> {selectedEntry.gps_location?.longitude || '-'}</p>
              <p style={{ margin: 0 }}><strong>Timestamp:</strong> {selectedEntry.gps_location?.timestamp || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
