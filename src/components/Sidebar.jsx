import React from 'react';
import { Home, ClipboardList, Activity, History, User, Baby, ShieldCheck } from 'lucide-react';

export default function Sidebar({ activeView, onViewChange, isPediatric }) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'assessment', label: 'New Scan', icon: ClipboardList },
    { id: 'checker', label: 'Food Checker', icon: ShieldCheck },
    { id: 'history', label: 'Past Scans', icon: History },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ];

  return (
    <div className="card" style={{
      width: '260px',
      height: 'calc(100vh - 40px)',
      margin: '20px',
      display: 'flex',
      flexDirection: 'column',
      padding: '30px 20px',
      position: 'fixed',
      background: 'white'
    }}>
      <div style={{ marginBottom: '40px', paddingLeft: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity size={20} color="white" />
        </div>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>NutriGen</h2>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '15px', background: isPediatric ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isPediatric ? <Baby size={20} color="var(--accent)" /> : <User size={20} color="var(--text-muted)" />}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>{isPediatric ? 'Pediatric Mode' : 'Adult Mode'}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Precision active</div>
        </div>
      </div>
    </div>
  );
}
