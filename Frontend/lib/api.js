const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

// Helper to check if backend is available
export async function checkBackendConnection() {
  try {
    const res = await fetch(`${API_BASE}/`, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    return res.ok;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
}

export async function fetchAudits() {
  try {
    const res = await fetch(`${API_BASE}/audit`, {
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch audits: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.audits || [];
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - backend may not be running');
    }
    if (error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend. Make sure it\'s running on http://localhost:4000');
    }
    console.error('Error fetching audits:', error);
    throw error;
  }
}

export async function fetchAuditById(id) {
  try {
    const res = await fetch(`${API_BASE}/audit/${id}`, {
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Audit not found');
      }
      throw new Error(`Failed to fetch audit: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.audit;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - backend may not be running');
    }
    if (error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend. Make sure it\'s running on http://localhost:4000');
    }
    console.error('Error fetching audit:', error);
    throw error;
  }
}

export async function createAudit(url) {
  try {
    const res = await fetch(`${API_BASE}/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(300000) // 5 minute timeout for audit creation
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || res.statusText || 'Failed to create audit');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - audit is taking longer than expected');
    }
    if (error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend. Make sure it\'s running on http://localhost:4000');
    }
    console.error('Error creating audit:', error);
    throw error;
  }
}

export function getPdfUrl(auditId) {
  return `${API_BASE}/audit/${auditId}/pdf`;
}

