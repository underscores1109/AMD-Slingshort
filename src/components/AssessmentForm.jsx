import React, { useState } from 'react';

const steps = [
  { id: 1, title: 'Basic Profile' },
  { id: 2, title: 'Daily Routine' },
  { id: 3, title: 'Medical History' },
  { id: 4, title: 'Dietary Lifestyle' },
];

export default function AssessmentForm({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [customCondition, setCustomCondition] = useState('');
  const [formData, setFormData] = useState({
    age: 30,
    gender: 'male',
    height: 170, // cm
    weight: 70, // kg
    activity: 'sedentary',
    sleepHours: 7,
    workHours: 8,
    exerciseFrequency: 'none',
    conditions: [],
    customConditions: [],
    allergies: [],
    preference: 'vegetarian',
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key, value) => {
    setFormData(prev => {
      const arr = prev[key];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter(item => item !== value) };
      }
      return { ...prev, [key]: [...arr, value] };
    });
  };

  const addCustomCondition = () => {
    if (customCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        customConditions: [...new Set([...prev.customConditions, customCondition.trim()])]
      }));
      setCustomCondition('');
    }
  };

  const removeCustomCondition = (cond) => {
    setFormData(prev => ({
      ...prev,
      customConditions: prev.customConditions.filter(c => c !== cond)
    }));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));
  const handleSkip = () => handleNext();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card animate-fade-in" style={{ padding: '40px', maxWidth: '650px', margin: '40px auto' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '10px', color: 'var(--primary)' }}>NutriGen Assessment</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Step {step} of 4: {steps.find(s => s.id === step).title}</p>
      </header>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '35px' }}>
        {steps.map(s => (
          <div key={s.id} style={{
            flex: 1, height: '6px', borderRadius: '4px',
            background: step >= s.id ? 'var(--accent)' : 'var(--border-color)',
            transition: 'background 0.3s ease, transform 0.2s ease',
            transform: step === s.id ? 'scaleY(1.2)' : 'scaleY(1)'
          }} />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: '20px' }}>Personal Metrics</h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label>Age</label>
                <input type="number" value={formData.age} onChange={e => updateForm('age', +e.target.value)} required />
              </div>
              <div style={{ flex: 1 }}>
                <label>Gender</label>
                <select value={formData.gender} onChange={e => updateForm('gender', e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label>Height (cm)</label>
                <input type="number" value={formData.height} onChange={e => updateForm('height', +e.target.value)} required />
              </div>
              <div style={{ flex: 1 }}>
                <label>Weight (kg)</label>
                <input type="number" value={formData.weight} onChange={e => updateForm('weight', +e.target.value)} required />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: '20px' }}>Daily Routine</h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label>Avg Sleep (Hours)</label>
                <input type="number" value={formData.sleepHours} onChange={e => updateForm('sleepHours', +e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Work/Study (Hours)</label>
                <input type="number" value={formData.workHours} onChange={e => updateForm('workHours', +e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Exercise Frequency</label>
              <select value={formData.exerciseFrequency} onChange={e => updateForm('exerciseFrequency', e.target.value)}>
                <option value="none">Rarely or None</option>
                <option value="light">Light (1-2 days/week)</option>
                <option value="moderate">Moderate (3-4 days/week)</option>
                <option value="heavy">Heavy (5+ days/week)</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Base Activity Level</label>
              <select value={formData.activity} onChange={e => updateForm('activity', e.target.value)}>
                <option value="sedentary">Sedentary (Desk job, limited walking)</option>
                <option value="moderate">Moderately Active (Standing/walking often)</option>
                <option value="active">Very Active (Physically demanding work)</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: '15px' }}>Medical History</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.85rem' }}>Understanding your health helps us prioritize specific nutrient adjustments.</p>
            
            <label>Predefined Conditions</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
              {['diabetes', 'hypertension', 'pcos', 'thyroid', 'anemia', 'obesity'].map(cond => (
                <button
                  type="button"
                  key={cond}
                  onClick={() => toggleArrayItem('conditions', cond)}
                  className="btn-secondary"
                  style={{
                    padding: '8px 16px', borderRadius: '20px', textTransform: 'capitalize', fontSize: '0.85rem',
                    background: formData.conditions.includes(cond) ? 'var(--primary)' : '#fff',
                    color: formData.conditions.includes(cond) ? '#fff' : 'var(--text-main)',
                    borderColor: formData.conditions.includes(cond) ? 'var(--primary)' : 'var(--border-color)'
                  }}
                >
                  {cond}
                </button>
              ))}
            </div>

            <label>Custom Disease or Condition</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input 
                type="text" 
                placeholder="e.g. GERD, IBS, Migraines" 
                value={customCondition} 
                onChange={e => setCustomCondition(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomCondition())}
              />
              <button type="button" onClick={addCustomCondition} className="btn-secondary" style={{ padding: '0 20px' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {formData.customConditions.map(c => (
                <span key={c} className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {c} <span onClick={() => removeCustomCondition(c)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>×</span>
                </span>
              ))}
            </div>

            <label>Allergies</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['lactose', 'gluten', 'nut', 'soy', 'shellfish'].map(alg => (
                <button
                  type="button"
                  key={alg}
                  onClick={() => toggleArrayItem('allergies', alg)}
                  className="btn-secondary"
                  style={{
                    padding: '8px 16px', borderRadius: '20px', textTransform: 'capitalize', fontSize: '0.85rem',
                    background: formData.allergies.includes(alg) ? '#ef4444' : '#fff',
                    color: formData.allergies.includes(alg) ? '#fff' : 'var(--text-main)',
                    borderColor: formData.allergies.includes(alg) ? '#ef4444' : 'var(--border-color)'
                  }}
                >
                  {alg}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: '20px' }}>Dietary Lifestyle</h3>
            <div style={{ marginBottom: '25px' }}>
              <label>Food Preference</label>
              <select value={formData.preference} onChange={e => updateForm('preference', e.target.value)}>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="non-vegetarian">Non-Vegetarian (Omnivore)</option>
              </select>
            </div>
            <div style={{ padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                <strong>Note:</strong> NutriGen AI uses a hybrid rule-based engine to simulate professional nutritional advice. Your routine and medical markers will be used to calculate a precision meal plan.
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
          <div>
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={handlePrev} style={{ marginRight: '10px' }}>Back</button>
            )}
            {(step === 2 || step === 3) && (
              <button type="button" className="btn-secondary" onClick={handleSkip} style={{ opacity: 0.7 }}>Skip</button>
            )}
          </div>
          
          {step < 4 ? (
            <button type="button" className="btn-primary" onClick={handleNext}>Continue</button>
          ) : (
            <button type="submit" className="btn-accent" style={{ padding: '12px 40px' }}>Generate Precision Plan</button>
          )}
        </div>
      </form>
    </div>
  );
}
