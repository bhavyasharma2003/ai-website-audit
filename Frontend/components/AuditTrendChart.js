import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AuditTrendChart({ audits }) {
  // Group audits by date and calculate average scores
  const dateMap = {};
  
  audits.forEach(audit => {
    if (!audit.createdAt) return;
    const date = new Date(audit.createdAt).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const scores = audit.lighthouse?.scores || {};
    
    if (!dateMap[date]) {
      dateMap[date] = { date, performance: [], seo: [], accessibility: [] };
    }
    
    if (typeof scores.performance === 'number') {
      dateMap[date].performance.push(scores.performance);
    }
    if (typeof scores.seo === 'number') {
      dateMap[date].seo.push(scores.seo);
    }
    if (typeof scores.accessibility === 'number') {
      dateMap[date].accessibility.push(scores.accessibility);
    }
  });

  const chartData = Object.values(dateMap)
    .map(entry => ({
      date: entry.date,
      Performance: entry.performance.length > 0
        ? Math.round(entry.performance.reduce((a, b) => a + b, 0) / entry.performance.length)
        : 0,
      SEO: entry.seo.length > 0
        ? Math.round(entry.seo.reduce((a, b) => a + b, 0) / entry.seo.length)
        : 0,
      Accessibility: entry.accessibility.length > 0
        ? Math.round(entry.accessibility.reduce((a, b) => a + b, 0) / entry.accessibility.length)
        : 0,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-15); // Last 15 data points

  if (chartData.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="Performance" 
          stroke="#2563eb" 
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="SEO" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="Accessibility" 
          stroke="#f59e0b" 
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

