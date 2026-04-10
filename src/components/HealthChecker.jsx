import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Search, PlusCircle, Frown, CheckCircle } from 'lucide-react';
import { FoodDatabase } from '../data/FoodDatabase';

export default function HealthChecker({ profile, engineOutput }) {
  const [query, setQuery] = useState('');
  const [checkedResults, setCheckedResults] = useState([]);
  
  if (!profile || !engineOutput) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-muted)' }}>No Health Profile Found</h3>
        <p>Please complete an assessment first to enable the Health Checker.</p>
      </div>
    );
  }

  const { finalRestrictions } = engineOutput;

  const checkFoodHealth = (foodName) => {
    const food = FoodDatabase.find(f => f.name.toLowerCase().includes(foodName.toLowerCase())) || {
        name: foodName,
        avoid: [],
        tags: ["Custom Input"]
    };

    let issues = [];
    finalRestrictions.forEach(restriction => {
        if (food.avoid.some(a => restriction.toLowerCase().includes(a)) || 
            food.name.toLowerCase().includes(restriction.toLowerCase())) {
            issues.push(`Contains or relates to your restricted item: ${restriction}`);
        }
    });

    // Special medical logic checks
    if (profile.conditions.includes('diabetes') && (food.carbs > 40 || foodName.toLowerCase().includes('sugar') || foodName.toLowerCase().includes('sweet'))) {
        issues.push("High Carb/Sugar content detected (Unsafe for Diabetes management)");
    }
    if (profile.conditions.includes('hypertension') && (foodName.toLowerCase().includes('salt') || foodName.toLowerCase().includes('pickle') || foodName.toLowerCase().includes('processed'))) {
        issues.push("Potential high sodium content (Unsafe for Hypertension)");
    }

    const result = {
        id: Date.now(),
        name: food.name,
        isSafe: issues.length === 0,
        issues: issues,
        timestamp: new Date().toLocaleTimeString()
    };

    setCheckedResults([result, ...checkedResults]);
    setQuery('');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--primary)' }}>Daily Food Checker</h1>
        <p style={{ color: 'var(--text-muted)' }}>Input what you ate today to check if it aligns with your medical constraints.</p>
      </header>

      <div className="card" style={{ padding: '30px', marginBottom: '30px', display: 'flex', gap: '15px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} size={20} />
          <input 
            type="text" 
            placeholder="Search food or type yours (e.g. Pasta, Sugar, Nuts)..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && checkFoodHealth(query)}
            style={{ paddingLeft: '45px', border: '1px solid #cbd5e1' }}
          />
        </div>
        <button className="btn-primary" onClick={() => checkFoodHealth(query)} style={{ minWidth: '160px' }}>
          <ShieldCheck size={18} /> Check Health
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {checkedResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
             <Search size={48} style={{ opacity: 0.1, marginBottom: '15px' }} />
             <p>Your scan history will appear here.</p>
          </div>
        ) : (
          checkedResults.map(res => (
            <div key={res.id} className="card animate-fade-in" style={{ 
                padding: '20px', 
                borderLeft: `5px solid ${res.isSafe ? 'var(--accent)' : '#ef4444'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                  {res.isSafe ? <CheckCircle size={20} color="var(--accent)" /> : <ShieldAlert size={20} color="#ef4444" />}
                  <h4 style={{ fontSize: '1.2rem' }}>{res.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.timestamp}</span>
                </div>
                {res.isSafe ? (
                  <p style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>This food is safe for your current health profile.</p>
                ) : (
                  <ul style={{ color: '#ef4444', fontSize: '0.9rem', paddingLeft: '20px' }}>
                    {res.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                  </ul>
                )}
              </div>
              <div className={`badge ${res.isSafe ? 'badge-green' : 'badge-red'}`} style={{ padding: '8px 16px' }}>
                {res.isSafe ? 'HEALTHY' : 'UNSAFE'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
