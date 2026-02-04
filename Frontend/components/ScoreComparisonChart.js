import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ScoreComparisonChart({ audits }) {
  // Prepare data for the last 10 audits
  const chartData = audits
    .slice(0, 10)
    .reverse()
    .map(audit => {
      const scores = audit.lighthouse?.scores || {};
      return {
        name: new URL(audit.url).hostname.replace('www.', ''),
        Performance: Math.round(scores.performance || 0),
        SEO: Math.round(scores.seo || 0),
        Accessibility: Math.round(scores.accessibility || 0),
        'Best Practices': Math.round(scores.bestPractices || 0),
      };
    });

  if (chartData.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        No audit data available for comparison
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={100}
          interval={0}
        />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Performance" fill="#2563eb" />
        <Bar dataKey="SEO" fill="#10b981" />
        <Bar dataKey="Accessibility" fill="#f59e0b" />
        <Bar dataKey="Best Practices" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  );
}

