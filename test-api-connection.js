// Simple Node.js script to test backend API connection
const http = require('http');

const API_BASE = 'http://localhost:4000';

async function testConnection() {
  console.log('🔍 Testing backend API connection...\n');
  console.log(`Target: ${API_BASE}\n`);

  return new Promise((resolve) => {
    // Test 1: Root endpoint
    console.log('1. Testing GET / ...');
    http.get(`${API_BASE}/`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`   ✅ Status: ${res.statusCode}`);
        console.log(`   Response: ${data}\n`);

        // Test 2: Audits endpoint
        console.log('2. Testing GET /audit ...');
        http.get(`${API_BASE}/audit`, (res2) => {
          let data2 = '';
          res2.on('data', (chunk) => { data2 += chunk; });
          res2.on('end', () => {
            if (res2.statusCode === 200) {
              try {
                const json = JSON.parse(data2);
                console.log(`   ✅ Status: ${res2.statusCode}`);
                console.log(`   Audits found: ${json.audits?.length || 0}\n`);
                console.log('✅ All API endpoints are working!\n');
                console.log('💡 You can now start the frontend:');
                console.log('   cd Frontend && npm run dev\n');
                resolve(true);
              } catch (e) {
                console.log(`   ⚠️  Status: ${res2.statusCode}`);
                console.log(`   Response: ${data2}\n`);
                resolve(false);
              }
            } else {
              console.log(`   ⚠️  Status: ${res2.statusCode}`);
              console.log(`   Response: ${data2}\n`);
              resolve(false);
            }
          });
        }).on('error', (err) => {
          console.error(`   ❌ Error: ${err.message}\n`);
          console.error('❌ Backend is not running or not accessible.\n');
          console.error('💡 Start the backend with: npm run backend\n');
          resolve(false);
        });
      });
    }).on('error', (err) => {
      console.error(`   ❌ Error: ${err.message}\n`);
      console.error('❌ Backend is not running or not accessible.\n');
      console.error('💡 Start the backend with: npm run backend\n');
      resolve(false);
    });
  });
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});

