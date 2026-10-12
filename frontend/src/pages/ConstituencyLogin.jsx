import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PASSWORDS = {
  'vadgaon-sheri': 'VS@208$Pune#10',
  'kasba-peth': 'KP@215$Pune#08'
};

const NAMES = {
  'vadgaon-sheri': 'Pune-208 Vadgaon Sheri',
  'kasba-peth': 'Pune-215 Kasba Peth'
};

export default function ConstituencyLogin() {
  const { dashboardId } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);

  const cleanId = dashboardId?.toLowerCase();

  useEffect(() => {
    // If the dashboard is already unlocked, navigate there immediately
    if (sessionStorage.getItem('access_' + cleanId) === 'true') {
      navigate(`/dashboard/${cleanId}`);
    }
  }, [cleanId]);

  if (!PASSWORDS[cleanId]) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Invalid Constituency</h2>
        <p>This campaign dashboard is not configured.</p>
        <button onClick={() => navigate('/services/campaign')} className="btn btn-primary" style={{ border: 'none' }}>Go Back</button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (PASSWORDS[cleanId] === password) {
      sessionStorage.setItem('access_' + cleanId, 'true');
      navigate(`/dashboard/${cleanId}`);
    } else {
      setErrorMsg(true);
      setPassword('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #101524 0%, #1e293b 100%)',
      padding: '2rem 1rem'
    }}>
      <div className="login-card" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(0, 191, 255, 0.1)',
          color: '#00bfff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          margin: '0 auto 1.5rem'
        }}>
          <i className="fa-solid fa-lock"></i>
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 10px', color: 'white' }}>
          {NAMES[cleanId]}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          Please enter the password for this constituency dashboard.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <input 
              type="password" 
              placeholder="Enter Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.95rem 1rem 0.95rem 3rem',
                borderRadius: '30px',
                border: '1.5px solid rgba(255,255,255,0.2)',
                background: 'rgba(0,0,0,0.2)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <i className="fa-solid fa-key" style={{ position: 'absolute', left: '1.2rem', color: '#00bfff' }}></i>
          </div>

          {errorMsg && (
            <div style={{ color: '#ff5252', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600 }}>
              Invalid password. Please try again.
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '0.9rem', 
              borderRadius: '30px', 
              border: 'none', 
              fontWeight: 'bold', 
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Access Dashboard <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
