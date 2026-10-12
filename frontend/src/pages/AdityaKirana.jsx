import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const initialInventory = [
  { id: 'AK-101', name: 'Basmati Rice (Premium)', category: 'Grains & Pulses', stock: '45 kg', price: '₹95 / kg', status: 'In Stock', badge: 'in-stock' },
  { id: 'AK-102', name: 'Fortune Mustard Oil', category: 'Edible Oils', stock: '24 L', price: '₹165 / L', status: 'In Stock', badge: 'in-stock' },
  { id: 'AK-103', name: 'Tata Salt (Lite)', category: 'Grocery', stock: '0 kg', price: '₹28 / kg', status: 'Out of Stock', badge: 'out-of-stock' },
  { id: 'AK-104', name: 'Everest Garam Masala', category: 'Spices', stock: '5 packs', price: '₹45 / pack', status: 'Low Stock', badge: 'low-stock' },
  { id: 'AK-105', name: 'Amul Butter (100g)', category: 'Dairy', stock: '35 packs', price: '₹56 / pack', status: 'In Stock', badge: 'in-stock' },
  { id: 'AK-106', name: 'Maggi 2-Min Noodles', category: 'Snacks', stock: '120 packs', price: '₹14 / pack', status: 'In Stock', badge: 'in-stock' },
  { id: 'AK-107', name: 'Surf Excel Easy Wash (1kg)', category: 'Household', stock: '3 packs', price: '₹140 / pack', status: 'Low Stock', badge: 'low-stock' },
  { id: 'AK-108', name: 'Britannia Marie Gold', category: 'Snacks', stock: '0 packs', price: '₹30 / pack', status: 'Out of Stock', badge: 'out-of-stock' },
];

export default function AdityaKirana() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState(initialInventory);

  useEffect(() => {
    const userStr = localStorage.getItem("oit_logged_in_user");
    if (!userStr) {
      navigate('/login');
      return;
    }
    try {
      setUser(JSON.parse(userStr));
    } catch(e) {
      console.error(e);
    }
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const q = query.toLowerCase().trim();
    if (q === '') {
      setInventory(initialInventory);
    } else {
      const filtered = initialInventory.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q)
      );
      setInventory(filtered);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("oit_logged_in_user");
    navigate('/');
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '3rem 1.5rem', fontFamily: "'Outfit', sans-serif" }}>
      <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
        
        {/* Dashboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', background: 'white', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#1e293b', fontWeight: 800 }}>Aditya Kirana</h2>
            <p style={{ margin: '5px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enterprise Inventory Database</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Welcome, <strong style={{ color: 'var(--brand)' }}>{user?.name || 'Onkar Holkar'}</strong></span>
            <button onClick={handleLogout} className="btn" style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem 1rem', borderRadius: '30px', cursor: 'pointer', fontWeight: 600 }}>
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="stat-card" style={{ background: 'white', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-icon primary" style={{ fontSize: '1.5rem', background: '#e0f2fe', color: '#0284c7', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-boxes-stacked"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>148</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Items</p>
            </div>
          </div>

          <div className="stat-card" style={{ background: 'white', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-icon success" style={{ fontSize: '1.5rem', background: '#dcfce7', color: '#16a34a', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>124</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>In Stock</p>
            </div>
          </div>

          <div className="stat-card" style={{ background: 'white', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-icon warning" style={{ fontSize: '1.5rem', background: '#fef3c7', color: '#d97706', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>18</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Low Stock</p>
            </div>
          </div>

          <div className="stat-card" style={{ background: 'white', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-icon danger" style={{ fontSize: '1.5rem', background: '#fee2e2', color: '#dc2626', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-circle-xmark"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>6</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Out of Stock</p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="content-card" style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Inventory Records</h3>
            <input 
              type="text" 
              placeholder="Search items by name or category..." 
              value={searchQuery}
              onChange={handleSearch}
              style={{ padding: '0.6rem 1.25rem', borderRadius: '30px', border: '1.5px solid var(--border)', width: '320px' }}
            />
          </div>

          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="inventory-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Item ID</th>
                  <th style={{ padding: '1rem' }}>Product Name</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Stock Level</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No matching items found.</td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{item.id}</td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--brand)' }}>{item.name}</td>
                      <td style={{ padding: '1rem' }}>{item.category}</td>
                      <td style={{ padding: '1rem' }}>{item.stock}</td>
                      <td style={{ padding: '1rem' }}>{item.price}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${item.badge}`} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="btn" style={{ background: '#e2e8f0', color: '#1e293b', textDecoration: 'none', padding: '0.8rem 2rem', borderRadius: '30px' }}>
            &larr; Go to Home Page
          </Link>
        </div>

      </div>
    </div>
  );
}
