import React, { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import AssessmentForm from './components/AssessmentForm';
import Dashboard from './components/Dashboard';
import HealthChecker from './components/HealthChecker';
import PastScans from './components/PastScans';
import AnalyticsDashboard from './components/AnalyticsDashboard';

import { calculateBMI, calculateBMR, calculateTDEE, calculateCalorieGoal, calculateMacros } from './engine/Calculations';
import { applyConditionRules, applyAllergyRules } from './engine/DietaryRules';
import { generateDailyPlan } from './engine/MealGenerator';
import { saveScan, getScans, clearScans } from './services/StorageService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Something went wrong in the clinical engine.</h2>
          <button className="btn-primary" onClick={() => { localStorage.clear(); window.location.reload(); }}>Reset & Clear Data</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [view, setView] = useState('overview');
  const [scans, setScans] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    try {
      const stored = getScans();
      setScans(stored || []);
    } catch (e) {
      console.error('Failed to load scans', e);
      setScans([]);
    }
  }, []);

  const latestScan = scans.length > 0 ? scans[0] : null;

  const processProfile = (profile) => {
    setIsProcessing(true);
    setView('loading');
    
    try {
      setTimeout(() => {
        const bmi = calculateBMI(profile.weight, profile.height);
        const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
        const tdee = calculateTDEE(bmr, profile.activity);
        const targetCalories = calculateCalorieGoal(tdee, bmi);
        const baseMacros = calculateMacros(targetCalories, bmi);

        const allConditions = [...new Set([...profile.conditions, ...profile.customConditions])];
        const medical = applyConditionRules(allConditions, baseMacros);
        
        const tempMacros = medical.adjustedMacros;
        const finalRestrictions = [...new Set([...medical.restrictions, ...applyAllergyRules(profile.allergies)])];
        const finalRecommendations = [...new Set(medical.recommendations)];

        const plan = generateDailyPlan(profile.preference, finalRestrictions, targetCalories, tempMacros);

        const computed = {
          bmi, bmr, tdee,
          calories: targetCalories,
          macros: tempMacros,
          finalRestrictions,
          finalRecommendations,
          insights: medical.insights,
          plan
        };

        const newScan = saveScan({ profile, engineOutput: computed });
        setScans([newScan, ...scans]);
        setIsProcessing(false);
        setView('overview');
      }, 1500);
    } catch (err) {
      console.error('Processing error', err);
      setIsProcessing(false);
      setView('overview');
    }
  };

  const deleteScan = (id) => {
    const updated = scans.filter(s => s.id !== id);
    setScans(updated);
    localStorage.setItem('nutrigen_past_scans', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all health history?')) {
      clearScans();
      setScans([]);
    }
  };

  const isPediatric = latestScan?.profile?.age < 18;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <Sidebar 
        activeView={view} 
        onViewChange={setView} 
        isPediatric={isPediatric}
      />
      
      <main style={{ flex: 1, marginLeft: '300px', padding: '40px 60px' }}>
        <ErrorBoundary>
          {view === 'overview' && (
            latestScan ? (
              <Dashboard engineData={latestScan} onReset={() => setView('assessment')} />
            ) : (
              <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '100px' }}>
                <div className="card" style={{ padding: '60px', maxWidth: '600px', margin: '0 auto', background: 'white' }}>
                  <h1 style={{ marginBottom: '20px', color: 'var(--primary)' }}>NutriGen Professional</h1>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Our clinical engine is ready to analyze your biometrics. Please complete your first baseline scan to generate your interactive health suite.</p>
                  <button className="btn-primary" onClick={() => setView('assessment')} style={{ padding: '16px 40px', fontSize: '1.1rem' }}>Initialize Health Profile</button>
                </div>
              </div>
            )
          )}

          {view === 'assessment' && (
            <AssessmentForm onSubmit={processProfile} />
          )}

          {view === 'checker' && (
            <HealthChecker profile={latestScan?.profile} engineOutput={latestScan?.engineOutput} />
          )}

          {view === 'history' && (
            <PastScans 
              scans={scans} 
              onSelectScan={(scan) => { /* Detail view could be here */ }} 
              onDeleteScan={deleteScan}
              onClearAll={handleClearAll}
            />
          )}

          {view === 'analytics' && (
            <AnalyticsDashboard scans={scans} />
          )}

          {view === 'loading' && (
            <div className="animate-fade-in" style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '50px', height: '50px', border: '3px solid #e2e8f0', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <h3 style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Synthesizing Health Profile...</h3>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;

export default App;
