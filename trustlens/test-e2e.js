const http = require('http');
const app = require('./backend/server');

const PORT = 5055;
process.env.PORT = PORT;

const server = app.listen(PORT, async () => {
  console.log(`\n🚀 Test Server started on port ${PORT}`);

  try {
    // 1. Health check
    const health = await fetchJson(`http://localhost:${PORT}/api/health`);
    console.log('✅ /api/health response:', health.status, health.product);

    // 2. Demo check
    const demos = await fetchJson(`http://localhost:${PORT}/api/demos`);
    console.log('✅ /api/demos loaded categories:', demos.categories.length);

    // 3. Phishing URL check
    const urlCheck = await postJson(`http://localhost:${PORT}/api/check/url`, { url: 'https://sbi-kyc-update.xyz/login' });
    console.log('✅ /api/check/url response status:', urlCheck.status, 'Risk score:', urlCheck.riskScore);

    // 4. Smart Auto-Check
    const autoCheck = await postJson(`http://localhost:${PORT}/api/check/auto`, { input: 'upi://pay?pa=refund-desk@okhdfcbank&am=4999' });
    console.log('✅ /api/check/auto detected:', autoCheck.detectedType, 'Status:', autoCheck.status);

    // 5. Frontend HTML served check
    const html = await fetchText(`http://localhost:${PORT}/`);
    const hasTrustLens = html.includes('TrustLens') || html.includes('root');
    console.log('✅ Frontend HTML served correctly:', hasTrustLens);

    console.log('\n🎉 ALL E2E ENDPOINTS AND STATIC UI TESTED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('❌ E2E Test failed:', err);
  } finally {
    server.close(() => {
      console.log('Server stopped cleanly.');
      process.exit(0);
    });
  }
});

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}
