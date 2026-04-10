import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Activity, TrendingUp, Info } from 'lucide-react';

export default function AnalyticsDashboard({ scans }) {
  // Mock data if no scans exist
  const hasData = scans && scans.length > 0;
  
  const chartData = hasData ? scans.slice().reverse().map(s => ({
    date: new Date(s.date).toLocaleDateString(),
    bmi: s.engineOutput.bmi,
    calories: s.engineOutput.calories
  })) : [
    { date: 'Day 1', bmi: 26.5, calories: 2200 },
    { date: 'Day 5', bmi: 26.3, calories: 2150 },
    { date: 'Day 10', bmi: 26.0, calories: 2100 },
    { date: 'Day 15', bmi: 25.8, calories: 2050 },
    { date: 'Day 20', bmi: 25.5, calories: 2000 },
  ];

  const currentScan = hasData ? scans[0] : null;
  const macroData = currentScan ? [
    { name: 'Protein', value: currentScan.engineOutput.macros.protein * 4, color: '#2563eb' },
    { name: 'Carbs', value: currentScan.engineOutput.macros.carbs * 4, color: '#10b981' },
    { name: 'Fats', value: currentScan.engineOutput.macros.fats * 9, color: '#f59e0b' }
  ] : [
    { name: 'Protein', value: 30, color: '#2563eb' },
    { name: 'Carbs', value: 45, color: '#10b981' },
    { name: 'Fats', value: 25, color: '#f59e0b' }
  ];

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--primary)' }}>Health Analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Visualizing your physiological markers and nutritional adherence trends.</p>
      </header>

      {!hasData && (
        <div className="card" style={{ padding: '15px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '4px solid var(--primary)', background: '#f0f9ff' }}>
          <Info size={20} color="var(--primary)" />
          <p style={{ fontSize: '0.9rem', color: '#0369a1' }}>Showing demo data. Complete more scans to see your real progress trends.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px', marginBottom: '30px' }}>
        
        {/* BMI Trend Chart */}
        <div className="card" style={{ padding: '25px', height: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={20} color="var(--primary)" /> BMI Trend analysis
            </h3>
            <span className="badge badge-blue">Baseline vs Progress</span>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Line type="monotone" dataKey="bmi" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Macro Distribution */}
        <div className="card" style={{ padding: '25px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="var(--accent)" /> Caloric Split
          </h3>
          <div style={{ display: 'flex', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px', paddingLeft: '20px' }}>
              {macroData.map(m => (
                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: m.color }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Calorie Goal Chart */}
      <div className="card" style={{ padding: '25px', height: '350px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Precision Nutritional Requirements</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="calories" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
}
