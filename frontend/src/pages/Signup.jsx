import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCaptchaClick = () => {
    if (captchaVerified || captchaLoading) return;
    setCaptchaError(false);
    setCaptchaLoading(true);
    setTimeout(() => {
      setCaptchaLoading(false);
      setCaptchaVerified(true);
    }, 1000);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setCaptchaError(false);

    if (!captchaVerified) {
      setCaptchaError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password
    };

    try {
      const storedUsers = localStorage.getItem("oit_stack_users");
      let users = [];
      if (storedUsers) {
        users = JSON.parse(storedUsers);
      }

      // Check if user already exists
      if (users.some(u => u.email === newUser.email)) {
        setErrorMsg("An account with this email already exists.");
        return;
      }

      users.push(newUser);
      localStorage.setItem("oit_stack_users", JSON.stringify(users));
      navigate('/login');
    } catch (e) {
      console.error("Error saving user:", e);
      setErrorMsg("Unable to save user data. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom, #7462d0 78%, #ffffff 78%)',
      padding: '2rem 1rem',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <div className="login-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        alignItems: 'center',
        gap: '3rem'
      }}>
        {/* Left illustration */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img 
            src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop" 
            alt="Register Illustration" 
            style={{ maxWidth: '100%', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          />
        </div>

        {/* Right card */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="auth-card" style={{
            background: '#ffffff',
            padding: '3rem 2.5rem',
            borderRadius: '24px',
            boxShadow: '0 20px 45px rgba(10, 25, 47, 0.12)',
            width: '100%',
            maxWidth: '460px',
            textAlign: 'left'
          }}>
            <div className="auth-header" style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2F2A8A', margin: '0 0 10px' }}>Create Account</h1>
              <p style={{ color: '#7a70a0', margin: 0, fontSize: '0.95rem' }}>Join our growing corporate & strategic community</p>
            </div>

            {errorMsg && (
              <div style={{
                padding: '0.8rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                textAlign: 'center',
                fontSize: '0.9rem',
                fontWeight: 600,
                backgroundColor: '#ffebee',
                color: '#d32f2f'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSignup}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <div className="input-wrapper">
                  <span className="input-icon" style={{ left: '1.2rem', color: '#2F2A8A' }}><i className="fa-solid fa-user-tag"></i></span>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1rem 0.95rem 3.2rem',
                      borderRadius: '30px',
                      border: '1.5px solid #dcdbe9',
                      fontSize: '1rem',
                      color: '#2F2A8A',
                      background: 'white'
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <div className="input-wrapper">
                  <span className="input-icon" style={{ left: '1.2rem', color: '#2F2A8A' }}><i className="fa-solid fa-envelope"></i></span>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1rem 0.95rem 3.2rem',
                      borderRadius: '30px',
                      border: '1.5px solid #dcdbe9',
                      fontSize: '1rem',
                      color: '#2F2A8A',
                      background: 'white'
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <div className="input-wrapper">
                  <span className="input-icon" style={{ left: '1.2rem', color: '#2F2A8A' }}><i className="fa-solid fa-lock"></i></span>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1rem 0.95rem 3.2rem',
                      borderRadius: '30px',
                      border: '1.5px solid #dcdbe9',
                      fontSize: '1rem',
                      color: '#2F2A8A',
                      background: 'white'
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <div className="input-wrapper">
                  <span className="input-icon" style={{ left: '1.2rem', color: '#2F2A8A' }}><i className="fa-solid fa-shield"></i></span>
                  <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1rem 0.95rem 3.2rem',
                      borderRadius: '30px',
                      border: '1.5px solid #dcdbe9',
                      fontSize: '1rem',
                      color: '#2F2A8A',
                      background: 'white'
                    }}
                  />
                </div>
              </div>

              {/* Mock reCAPTCHA */}
              <div className="recaptcha-container" style={{
                background: '#f9f9f9',
                border: '1px solid #d3d3d3',
                borderRadius: '3px',
                padding: '10px 10px 10px 15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '74px',
                width: '302px',
                marginBottom: '1.5rem',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    onClick={handleCaptchaClick}
                    style={{
                      width: '24px',
                      height: '24px',
                      border: '2px solid #c1c1c1',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: captchaVerified ? '#fff' : 'transparent'
                    }}
                  >
                    {captchaLoading && (
                      <div className="recaptcha-spinner" style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #4a90e2',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    )}
                    {captchaVerified && (
                      <i className="fa-solid fa-check" style={{ color: '#00aa4f', fontSize: '1.1rem' }}></i>
                    )}
                  </div>
                  <span style={{ fontSize: '13px', color: '#000', fontWeight: 400 }}>I'm not a robot</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" style={{ width: '32px', height: '32px' }} />
                  <span style={{ fontSize: '8px', color: '#555', marginTop: '2px' }}>reCAPTCHA</span>
                  <div style={{ display: 'flex', gap: '4px', fontSize: '8px', color: '#555' }}>
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#555' }}>Privacy</a>
                    <span>-</span>
                    <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#555' }}>Terms</a>
                  </div>
                </div>
              </div>

              {captchaError && (
                <div style={{ color: '#ff3333', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                  <i className="fa-solid fa-circle-exclamation"></i> Please verify that you are not a robot.
                </div>
              )}

              <button 
                type="submit" 
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  border: 'none',
                  borderRadius: '30px',
                  background: '#7462d0',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 16px rgba(116, 98, 208, 0.25)',
                  transition: 'all 0.3s'
                }}
              >
                Register
              </button>
            </form>

            <div className="auth-footer" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#7a70a0' }}>
              Already have an account? <Link to="/login" style={{ color: '#7462d0', fontWeight: 600, textDecoration: 'none' }}>Login here</Link>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
