import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
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

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setCaptchaError(false);

    if (!captchaVerified) {
      setCaptchaError(true);
      return;
    }

    const usernameInput = email.trim().toLowerCase();
    const passwordInput = password;

    // Check for Employee Data Entry account admin01@gmail.com
    if (usernameInput === "admin01@gmail.com" && passwordInput === "123456") {
      const adminUser = {
        name: "Data Entry Employee",
        email: "admin01@gmail.com",
        role: "employee",
        isDataEntryAdmin: true
      };
      localStorage.setItem("oit_logged_in_user", JSON.stringify(adminUser));
      sessionStorage.setItem("data_entry_access", "true");
      
      // Call API auth in background if server is running
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: "admin01@gmail.com", password: "123456" })
      })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("oit_token", data.token);
        }
      })
      .catch(err => console.log('API login fallback:', err));

      navigate('/data-entry');
      return;
    }

    // Check for Search Data account admin02@gmail.com
    if (usernameInput === "admin02@gmail.com" && (passwordInput === "01234567" || passwordInput === "123456")) {
      const admin02User = {
        name: "Search Data Employee",
        email: "admin02@gmail.com",
        role: "employee",
        isSearchDataAdmin: true
      };
      localStorage.setItem("oit_logged_in_user", JSON.stringify(admin02User));
      sessionStorage.setItem("search_data_access", "true");
      
      // Call API auth in background if server is running
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: "admin02@gmail.com", password: "01234567" })
      })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("oit_token", data.token);
        }
      })
      .catch(err => console.log('API login fallback:', err));

      navigate('/search-data');
      return;
    }

    // Check for special username 'onkarholkar' or 'onkarholkar19@gmail.com'
    if (usernameInput === "onkarholkar" || usernameInput === "onkarholkar19@gmail.com") {
      const onkarUser = { name: "Onkar Holkar", email: usernameInput, role: 'admin' };
      localStorage.setItem("oit_logged_in_user", JSON.stringify(onkarUser));
      navigate('/aditya-kirana');
      return;
    }

    // Validate from localStorage registered users
    let users = [];
    try {
      const storedUsers = localStorage.getItem("oit_stack_users");
      if (storedUsers) {
        users = JSON.parse(storedUsers);
      }
    } catch (e) {
      console.error("Error reading users:", e);
    }

    const matchedUser = users.find(u => u.email === usernameInput && u.password === passwordInput);
    if (!matchedUser) {
      setErrorMsg("Invalid username/email or password.");
      return;
    }

    // Save session
    localStorage.setItem("oit_logged_in_user", JSON.stringify(matchedUser));
    const targetRedirect = searchParams.get("redirect") || "/";
    navigate(targetRedirect);
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
        {/* Left column illustration */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img 
            src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop" 
            alt="Login Illustration" 
            style={{ maxWidth: '100%', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          />
        </div>

        {/* Right card column */}
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
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2F2A8A', margin: '0 0 10px' }}>Welcome To Family</h1>
              <p style={{ color: '#7a70a0', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                A community of over hundreds of members<br />To share arts and ideas
              </p>
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

            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <div className="input-wrapper">
                  <span className="input-icon" style={{ left: '1.2rem', color: '#2F2A8A' }}><i className="fa-solid fa-user"></i></span>
                  <input 
                    type="text" 
                    placeholder="Username or email" 
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
                  <span 
                    className="input-icon" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ left: '1.2rem', color: '#2F2A8A', cursor: 'pointer', zIndex: 10 }}
                  >
                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
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

              <div className="auth-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <label className="remember-me-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#7a70a0' }}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()} style={{ color: '#7462d0', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</a>
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
                      background: captchaVerified ? '#fff' : 'transparent',
                      position: 'relative'
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
                Login
              </button>
            </form>

            <div className="auth-footer" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#7a70a0' }}>
              Don't have an account? <Link to="/signup" style={{ color: '#7462d0', fontWeight: 600, textDecoration: 'none' }}>Create new account</Link>
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
