// Test script to verify backend API connection
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

async function testApiConnection() {
  console.log('🔍 Testing API connection to:', API_BASE);
  
  try {
    // Test 1: Root endpoint
    console.log('\n1. Testing root endpoint (GET /)...');
    const rootRes = await fetch(`${API_BASE}/`);
    const rootText = await rootRes.text();
    console.log('   Status:', rootRes.status);
    console.log('   Response:', rootText);
    
    // Test 2: Get audits list
    console.log('\n2. Testing audits endpoint (GET /audit)...');
    const auditsRes = await fetch(`${API_BASE}/audit`);
    if (!auditsRes.ok) {
      throw new Error(`HTTP ${auditsRes.status}: ${auditsRes.statusText}`);
    }
    const auditsData = await auditsRes.json();
    console.log('   Status:', auditsRes.status);
    console.log('   Audits found:', auditsData.audits?.length || 0);
    
    console.log('\n✅ API connection successful!');
    return true;
  } catch (error) {
    console.error('\n❌ API connection failed:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Backend server is running: npm run backend');
    console.error('   2. Backend is listening on http://localhost:4000');
    console.error('   3. MongoDB is connected (if required)');
    return false;
  }
}

// Run test if called directly
if (typeof window === 'undefined') {
  testApiConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { testApiConnection };

