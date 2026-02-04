import { useState, useEffect } from 'react';
import { checkBackendConnection, fetchAudits } from '../lib/api';

export default function ApiTest() {
  const [status, setStatus] = useState('Testing...');
  const [connected, setConnected] = useState(null);
  const [auditsCount, setAuditsCount] = useState(null);

  useEffect(() => {
    async function test() {
      // Test 1: Check backend connection
      const isConnected = await checkBackendConnection();
      setConnected(isConnected);
      
      if (isConnected) {
        setStatus('✅ Backend is connected!');
        
        // Test 2: Try to fetch audits
        try {
          const audits = await fetchAudits();
          setAuditsCount(audits.length);
          setStatus(`✅ Backend is connected! Found ${audits.length} audit(s).`);
        } catch (error) {
          setStatus(`⚠️ Backend connected but error fetching audits: ${error.message}`);
        }
      } else {
        setStatus('❌ Backend is not connected. Make sure it\'s running on http://localhost:4000');
      }
    }
    
    test();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API Connection Test</h1>
      
      <div style={{
        padding: '20px',
        margin: '20px 0',
        background: connected ? '#d1fae5' : '#fee2e2',
        border: `2px solid ${connected ? '#10b981' : '#ef4444'}`,
        borderRadius: '8px'
      }}>
        <h2 style={{ marginTop: 0 }}>Status</h2>
        <p style={{ fontSize: '18px' }}>{status}</p>
        
        {connected !== null && (
          <div style={{ marginTop: '20px' }}>
            <p><strong>Connection:</strong> {connected ? '✅ Connected' : '❌ Not Connected'}</p>
            {auditsCount !== null && (
              <p><strong>Audits in database:</strong> {auditsCount}</p>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h3>Next Steps:</h3>
        <ol>
          <li>If not connected, start the backend:
            <pre style={{ background: '#1f2937', color: '#fff', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
              npm run backend
            </pre>
          </li>
          <li>Make sure MongoDB is running (if required)</li>
          <li>Check that the backend is listening on <code>http://localhost:4000</code></li>
          <li>Once connected, go to <a href="/">Dashboard</a> to use the app</li>
        </ol>
      </div>
    </div>
  );
}

