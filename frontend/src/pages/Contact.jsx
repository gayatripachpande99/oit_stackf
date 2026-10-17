import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'software',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate contact submission
    console.log("Contact inquiry submitted:", formData);
    setSuccess(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: 'software',
      message: ''
    });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <>
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop') center/cover", position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 0 }}></div>
        <div className="container animate-on-scroll" style={{ position: 'relative', zIndex: 1, opacity: 1 }}>
          <h1>Contact Us</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
            We'd love to hear from you. Get in touch with our expert teams today.
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', textAlign: 'left' }}>
          
          {/* Contact Details & Map */}
          <div className="animate-on-scroll" style={{ opacity: 1 }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 700 }}>Get In Touch</h2>
            <p style={{ lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '2rem' }}>
              Whether you need software consulting, political strategic modeling, or localized ground assessments, our core teams are ready to support your organization.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <i className="fa-solid fa-location-dot" style={{ color: 'var(--brand)', fontSize: '1.25rem', marginTop: '3px' }}></i>
                <div>
                  <h4 style={{ margin: '0 0 5px', color: 'var(--text-heading)' }}>Our Headquarters</h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>Flat No.307, Goldcliff Society, Pune- 411015, Maharashtra, India</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <i className="fa-solid fa-phone" style={{ color: 'var(--brand)', fontSize: '1.25rem', marginTop: '3px' }}></i>
                <div>
                  <h4 style={{ margin: '0 0 5px', color: 'var(--text-heading)' }}>Call Us</h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>+91 8983461569</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <i className="fa-solid fa-envelope" style={{ color: 'var(--brand)', fontSize: '1.25rem', marginTop: '3px' }}></i>
                <div>
                  <h4 style={{ margin: '0 0 5px', color: 'var(--text-heading)' }}>Email Us</h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>onkarholkar@oitstack.com</p>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div style={{ height: '300px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <iframe
                src="https://maps.google.com/maps?q=Goldcliff%20Society,%20Vishrantwadi,%20Alandi%20Rd,%20Parande%20Nagar,%20Dighi,%20Pune,%20Maharashtra%20411015&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
              ></iframe>
            </div>
          </div>

          {/* Form Card */}
          <div className="animate-on-scroll" style={{ opacity: 1 }}>
            <div className="card" style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 700 }}>Request a Consultation</h3>
              
              {success && (
                <div style={{ padding: '1rem', background: '#d1fae5', color: '#065f46', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
                  <i className="fa-solid fa-circle-check"></i> Inquiry sent successfully! We will get in touch soon.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.9rem' }}>Your Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.95rem' }} 
                    placeholder="Enter your full name"
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.9rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.95rem' }} 
                    placeholder="name@company.com"
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.9rem' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.95rem' }} 
                    placeholder="+91 00000 00000"
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.9rem' }}>Required Service</label>
                  <select 
                    value={formData.service} 
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.95rem', background: 'white' }}
                  >
                    <option value="software">Software Development</option>
                    <option value="analytics">Political Data Analytics</option>
                    <option value="campaign">Campaign Management</option>
                    <option value="surveys">Political Surveys</option>
                    <option value="training">Corporate Training</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.9rem' }}>Brief Message</label>
                  <textarea 
                    rows="4" 
                    required 
                    value={formData.message} 
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '0.95rem', resize: 'vertical' }} 
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                  Submit Inquiry &rarr;
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
