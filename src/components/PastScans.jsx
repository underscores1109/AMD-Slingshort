import React from 'react';
import { Clock, ChevronRight, FileText, Trash2, Calendar } from 'lucide-react';

export default function PastScans({ scans, onSelectScan, onDeleteScan, onClearAll }) {
  if (!scans || scans.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
        <Clock size={48} style={{ color: 'var(--text-muted)', marginBottom: '20px', opacity: 0.3 }} />
        <h3>No scan history yet.</h3>
        <p style={{ color: 'var(--text-muted)' }}>Complete your first assessment to start tracking your health journey.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--primary)' }}>Scan History</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review and compare your professional nutrition blueprints over time.</p>
        </div>
        <button onClick={onClearAll} className="btn-secondary" style={{ color: '#ef4444' }}>
          <Trash2 size={16} style={{ marginRight: '8px' }} /> Clear History
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {scans.map(scan => (
          <div key={scan.id} className="card" style={{ 
            padding: '25px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            transition: 'transform 0.2s ease',
            cursor: 'pointer'
          }} onClick={() => onSelectScan(scan)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '50px', height: '50px', background: '#f0f9ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid #e0f2fe' }}>
                <FileText size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Scan Result: {scan.engineOutput.calories} kcal/day</h4>
                <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {new Date(scan.date).toLocaleDateString()}
                  </span>
                  <span className="badge badge-blue">BMI: {scan.engineOutput.bmi}</span>
                  <span className="badge badge-green">{scan.profile.preference}</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{scan.engineOutput.macros.protein}g P | {scan.engineOutput.macros.carbs}g C</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target: {scan.engineOutput.calories} Calories</div>
                </div>
                <button 
                  className="btn-secondary" 
                  onClick={(e) => { e.stopPropagation(); onDeleteScan(scan.id); }} 
                  style={{ padding: '8px', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Trash2 size={16} />
                </button>
                <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
