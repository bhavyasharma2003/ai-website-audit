import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ScoreDistributionChart({ audits }) {
  // Categorize scores
  const categories = {
    'Excellent (90-100)': 0,
    'Good (70-89)': 0,
    'Needs Improvement (50-69)': 0,
    'Poor (30-49)': 0,
    'Very Poor (0-29)': 0,
  };

  audits.forEach(audit => {
    const performance = audit.lighthouse?.scores?.performance;
    if (typeof performance === 'number') {
      if (performance >= 90) categories['Excellent (90-100)']++;
      else if (performance >= 70) categories['Good (70-89)']++;
      else if (performance >= 50) categories['Needs Improvement (50-69)']++;
      else if (performance >= 30) categories['Poor (30-49)']++;
      else categories['Very Poor (0-29)']++;
    }
  });

  const data = Object.entries(categories)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        No performance scores available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

