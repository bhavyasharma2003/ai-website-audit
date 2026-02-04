import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAudits, createAudit, checkBackendConnection } from '../lib/api';
import ScoreComparisonChart from '../components/ScoreComparisonChart';
import ScoreDistributionChart from '../components/ScoreDistributionChart';
import AuditTrendChart from '../components/AuditTrendChart';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString();
}

export default function Dashboard() {
  const router = useRouter();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auditStatus, setAuditStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [backendConnected, setBackendConnected] = useState(null);

  useEffect(() => {
    // Check backend connection on mount
    checkBackendConnection().then(connected => {
      setBackendConnected(connected);
      if (!connected) {
        setAuditStatus('⚠️ Backend not connected. Start backend with: npm run backend');
      }
    });
  }, []);

  const loadAudits = async () => {
    try {
      setLoading(true);
      const data = await fetchAudits();
      setAudits(data);
      setBackendConnected(true);
    } catch (error) {
      console.error('Failed to load audits:', error);
      setBackendConnected(false);
      if (error.message.includes('Cannot connect')) {
        setAuditStatus('⚠️ Cannot connect to backend. Make sure it\'s running on http://localhost:4000');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = urlInput.trim();
    if (!url) {
      setAuditStatus('Please enter a URL.');
      return;
    }

    setIsSubmitting(true);
    setAuditStatus('Starting audit...');

    try {
      await createAudit(url);
      setAuditStatus('Audit complete!');
      setUrlInput('');
      // Reload audits to show the new one
      await loadAudits();
    } catch (error) {
      setAuditStatus(`Audit failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate stats
  const totalAudits = audits.length;
  const pdfCount = audits.filter(a => a.pdfPath).length;
  const performanceScores = audits
    .map(a => a.lighthouse?.scores?.performance)
    .filter(score => typeof score === 'number');
  const avgPerformance = performanceScores.length > 0
    ? Math.round(performanceScores.reduce((a, b) => a + b, 0) / performanceScores.length)
    : 0;

  return (
    <>
      <header className="header">
        <h1>Website Audit Dashboard</h1>
        <p>AI-Powered Website Performance & SEO Audits</p>
      </header>

      <section className="stats">
        <div className="card">
          <h2>{totalAudits}</h2>
          <p>Total Audits</p>
        </div>
        <div className="card">
          <h2>{avgPerformance}</h2>
          <p>Average Performance</p>
        </div>
        <div className="card">
          <h2>{pdfCount}</h2>
          <p>PDF Reports</p>
        </div>
      </section>

      <form className="audit-form" onSubmit={handleSubmit}>
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://example.com"
          required
          disabled={isSubmitting}
        />
        <button type="submit" className="btn" disabled={isSubmitting}>
          Run Audit
        </button>
        <span className={`audit-status ${isSubmitting ? 'loading' : ''}`}>
          {auditStatus}
        </span>
      </form>

      {backendConnected === false && (
        <section className="box" style={{ margin: '20px', background: '#fef3c7', border: '1px solid #f59e0b' }}>
          <p style={{ color: '#92400e', margin: 0 }}>
            <strong>⚠️ Backend Connection Issue:</strong> Cannot connect to http://localhost:4000
            <br />
            Make sure the backend is running: <code>npm run backend</code>
          </p>
        </section>
      )}

      {/* Charts Section */}
      {audits.length > 0 && (
        <section className="charts-section">
          <div className="chart-grid">
            <div className="chart-card">
              <h2>Score Comparison</h2>
              <p className="chart-subtitle">Performance metrics across recent audits</p>
              <ScoreComparisonChart audits={audits} />
            </div>

            <div className="chart-card">
              <h2>Score Distribution</h2>
              <p className="chart-subtitle">Performance score categories</p>
              <ScoreDistributionChart audits={audits} />
            </div>

            <div className="chart-card chart-full-width">
              <h2>Audit Trends</h2>
              <p className="chart-subtitle">Performance trends over time</p>
              <AuditTrendChart audits={audits} />
            </div>
          </div>
        </section>
      )}

      <section className="table-section">
        <table>
          <thead>
            <tr>
              <th>Website</th>
              <th>Performance</th>
              <th>SEO</th>
              <th>Accessibility</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            ) : audits.length === 0 ? (
              <tr>
                <td colSpan="6">No audits yet.</td>
              </tr>
            ) : (
              audits.map((audit) => {
                const scores = audit.lighthouse?.scores || {};
                const performance = scores.performance ?? '-';
                const seo = scores.seo ?? '-';
                const accessibility = scores.accessibility ?? '-';

                return (
                  <tr key={audit._id}>
                    <td>{audit.url}</td>
                    <td>{performance}</td>
                    <td>{seo}</td>
                    <td>{accessibility}</td>
                    <td>{formatDate(audit.createdAt)}</td>
                    <td>
                      <a
                        className="btn"
                        href={`/audit/${audit._id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/audit/${audit._id}`);
                        }}
                      >
                        View
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

