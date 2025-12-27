// Cli/audit.js
const axios = require("axios");

function getUrl() {
  const args = process.argv.slice(2);

  // Accept: node Cli/audit.js https://example.com
  if (args.length === 1 && !args[0].startsWith("-")) {
    return args[0];
  }

  // Accept: node Cli/audit.js --url https://example.com
  const idx = args.findIndex(a => a === "--url" || a === "-u");
  if (idx !== -1 && args[idx + 1]) {
    return args[idx + 1];
  }

  return null;
}

async function run() {
  const url = getUrl();

  if (!url) {
    console.log(`❌ No URL provided.

Usage:
  node Cli/audit.js https://example.com
  OR
  node Cli/audit.js --url https://example.com
`);
    process.exit(1);
  }

  console.log("🚀 Starting audit for:", url);
  console.log("⏳ This may take 30-60 seconds (crawling + Lighthouse audit)...\n");

  try {
    const res = await axios.post(
      "http://localhost:4000/audit",
      { url },
      {
        // Allow up to 5 minutes for crawl + Lighthouse + AI + PDF
        timeout: 300000,
      }
    );

    console.log("\n✅ Audit Complete!");
    console.log("🔗 URL:", res.data.audit.url);
    
    // Display crawl data
    if (res.data.crawlData) {
      console.log("\n📄 Crawl Data:");
      console.log("   Title:", res.data.crawlData.title || "N/A");
      console.log("   Meta Description:", res.data.crawlData.metaDescription || "N/A");
      console.log("   H1 Headings:", res.data.crawlData.h1Headings?.length || 0);
      if (res.data.crawlData.h1Headings?.length > 0) {
        res.data.crawlData.h1Headings.forEach((h1, i) => {
          console.log(`      ${i + 1}. ${h1}`);
        });
      }
    }
    
    // Display Lighthouse scores
    if (res.data.audit.lighthouse?.scores) {
      console.log("\n📊 Lighthouse Scores:");
      console.log("   Performance:", res.data.audit.lighthouse.scores.performance);
      console.log("   Accessibility:", res.data.audit.lighthouse.scores.accessibility);
      console.log("   SEO:", res.data.audit.lighthouse.scores.seo);
      console.log("   Best Practices:", res.data.audit.lighthouse.scores.bestPractices);
    }
    
    // Display AI Summary
    if (res.data.audit.aiSummary) {
      console.log("\n🧠 AI Summary:");
      console.log("   Summary:", res.data.audit.aiSummary.summary);
      if (res.data.audit.aiSummary.recommendations?.length > 0) {
        console.log("   Recommendations:");
        res.data.audit.aiSummary.recommendations.forEach((rec, i) => {
          console.log(`      ${i + 1}. ${rec}`);
        });
      }
    }
    
    console.log("\n📄 PDF:", res.data.pdf || "Not generated");
  } catch (err) {
    console.log("\n❌ Audit failed.");

    if (err.response) {
      console.log("Status:", err.response.status);
      console.log("Response data:", err.response.data);
    } else if (err.request) {
      console.log("No response received from backend.");
      console.log("Request details:", err.request);
    } else {
      console.log("Error message:", err.message);
    }

    process.exit(1);
  }
}

run();
