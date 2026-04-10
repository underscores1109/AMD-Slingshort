import React from 'react';

export default function Dashboard({ engineData, onReset }) {
  const { profile, engineOutput } = engineData;
  const { calories, macros, bmi, finalRestrictions, finalRecommendations, insights, plan } = engineOutput;

  return (
    <div className="animate-fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Your Intelligent <span className="gradient-text">Health Plan</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Customized precision nutrition based on your biological markers.</p>
        </div>
        <button onClick={onReset} className="btn-secondary">Recalibrate</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        {/* Profile Card */}
        <div className="card" style={{ padding: '24px' }}>
          <h3>Biometrics Overview</h3>
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1' }}>{bmi}</div>
            <div style={{ paddingBottom: '5px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>Current BMI</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal (Healthy)' : 'Overweight'}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {profile.conditions.map(c => <span key={c} className="badge badge-red">{c}</span>)}
            {profile.allergies.map(a => <span key={a} className="badge badge-blue">No {a}</span>)}
            <span className="badge badge-green">{profile.preference}</span>
          </div>
        </div>

        {/* Macros Card */}
        <div className="card" style={{ padding: '24px' }}>
          <h3>Daily Nutrition Target</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '15px 0 25px 0', color: 'var(--text-main)' }}>
            {calories} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>kcal/day</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <MacroBar label="Protein" amount={macros.protein} total={calories} color="var(--primary)" calPerGram={4} />
            <MacroBar label="Carbohydrates" amount={macros.carbs} total={calories} color="var(--accent)" calPerGram={4} />
            <MacroBar label="Fats" amount={macros.fats} total={calories} color="#f59e0b" calPerGram={9} />
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '15px' }}>Medical Nutrition Insights</h3>
          {insights.length > 0 ? (
            <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              {insights.map((ins, i) => <li key={i}>{ins}</li>)}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Optimum healthy profile detected. Follow general WHO guidelines.</p>
          )}

          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', color: '#dc2626', textTransform: 'uppercase' }}>Avoid:</div>
            <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '500' }}>{finalRestrictions.join(', ') || 'None'}</div>
          </div>
        </div>

      </div>

      {/* Meal Plan View */}
      <div className="card" style={{ padding: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Today's Personalized Menu</h2>
        {plan && plan.meals ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <MealCard type="Breakfast" meal={plan.meals.breakfast} />
            <MealCard type="Lunch" meal={plan.meals.lunch} />
            <MealCard type="Snack" meal={plan.meals.snack} />
            <MealCard type="Dinner" meal={plan.meals.dinner} />
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Generating menu...</p>
        )}
      </div>

    </div>
  );
}

function MacroBar({ label, amount, total, color, calPerGram }) {
  const cals = amount * calPerGram;
  const percentage = (cals / total) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
        <span>{label}</span>
        <span style={{ fontWeight: '600' }}>{amount}g <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({Math.round(percentage)}%)</span></span>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '4px' }}></div>
      </div>
    </div>
  );
}

function MealCard({ type, meal }) {
  if (!meal) return null;
  return (
    <div style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>{type}</div>
      <h4 style={{ fontSize: '1.2rem', marginBottom: '15px', color: 'var(--text-main)' }}>{meal.name}</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
        {meal.tags && meal.tags.map(t => <span key={t} style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontWeight: '500' }}>{t}</span>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '15px', fontSize: '0.9rem' }}>
        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{meal.calories} kcal</span>
        <span style={{ color: 'var(--text-muted)' }}>P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g</span>
      </div>
    </div>
  );
}
