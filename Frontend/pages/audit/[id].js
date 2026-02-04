import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAuditById, getPdfUrl } from '../../lib/api';

export default function AuditDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadAudit = async () => {
      try {
        setLoading(true);
        const data = await fetchAuditById(id);
        setAudit(data);
      } catch (err) {
        console.error('Failed to load audit detail:', err);
        setError('Failed to load audit detail');
      } finally {
        setLoading(false);
      }
    };

    loadAudit();
  }, [id]);

  if (loading) {
    return (
      <>
        <header className="header">
          <h1>Audit Report</h1>
          <p>Loading...</p>
        </header>
      </>
    );
  }

  if (error || !audit) {
    return (
      <>
        <header className="header">
          <h1>Audit Report</h1>
          <p>{error || 'Audit not found'}</p>
        </header>
      </>
    );
  }

  const scores = audit.lighthouse?.scores || {};
  const crawlData = audit.crawlData || {};

  return (
    <>
      <header className="header">
        <h1>Audit Report</h1>
        <p>{audit.url}</p>
      </header>

      <section className="scores">
        <div className="score-card">
          <span>Performance</span>
          <strong>{scores.performance ?? '-'}</strong>
        </div>
        <div className="score-card">
          <span>SEO</span>
          <strong>{scores.seo ?? '-'}</strong>
        </div>
        <div className="score-card">
          <span>Accessibility</span>
          <strong>{scores.accessibility ?? '-'}</strong>
        </div>
        <div className="score-card">
          <span>Best Practices</span>
          <strong>{scores.bestPractices ?? '-'}</strong>
        </div>
      </section>

      <section className="box">
        <h2>Crawl Data</h2>
        <p><b>Title:</b> <span>{crawlData.title || 'N/A'}</span></p>
        <p><b>Meta Description:</b> <span>{crawlData.metaDescription || 'N/A'}</span></p>
        <p><b>H1 Tags:</b></p>
        <ul>
          {crawlData.h1Headings && crawlData.h1Headings.length > 0 ? (
            crawlData.h1Headings.map((h1, index) => (
              <li key={index}>{h1}</li>
            ))
          ) : (
            <li>None found</li>
          )}
        </ul>
      </section>

      <section className="box">
        <h2>AI Summary</h2>
        <p>{audit.aiSummary?.summary || 'No AI summary available.'}</p>
      </section>

      <section className="box">
        <h2>Recommendations</h2>
        <ul>
          {audit.aiSummary?.recommendations && audit.aiSummary.recommendations.length > 0 ? (
            audit.aiSummary.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))
          ) : (
            <li>No recommendations available.</li>
          )}
        </ul>
      </section>

      <section className="box">
        {audit.pdfPath ? (
          <a
            className="btn download"
            href={getPdfUrl(audit._id)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF Report
          </a>
        ) : (
          <span className="btn download" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            PDF not available
          </span>
        )}
      </section>
    </>
  );
}

