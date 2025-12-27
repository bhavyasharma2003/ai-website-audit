async function loadDeps() {
  // Both lighthouse and chrome-launcher are ESM; load dynamically
  const [lhMod, chromeMod] = await Promise.all([import('lighthouse'), import('chrome-launcher')]);
  const lighthouse = lhMod.default || lhMod;
  const chromeLauncher = chromeMod.default || chromeMod;
  return { lighthouse, chromeLauncher };
}

const DEFAULT_CHROME_PATH =
  process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Allow a longer window for Lighthouse to finish on slower machines.
const LIGHTHOUSE_TIMEOUT_MS = 300_000; // 300s (5 min) hard timeout

async function runLighthouse(url) {
  const { lighthouse, chromeLauncher } = await loadDeps();
  console.log("[lighthouse] launching chrome...");
  const chrome = await chromeLauncher.launch({
    chromePath: DEFAULT_CHROME_PATH,
    chromeFlags: [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Lighthouse timed out after ${LIGHTHOUSE_TIMEOUT_MS}ms`)), LIGHTHOUSE_TIMEOUT_MS);
  });

  try {
    console.log("[lighthouse] running audit...");
    const options = {
      port: chrome.port,
      output: 'json',
      logLevel: 'info',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      settings: {
        maxWaitForLoad: 60_000, // allow up to 60s for page load
        formFactor: 'desktop',
        screenEmulation: { mobile: false, disabled: false }
      }
    };

    const runnerResult = await Promise.race([
      lighthouse(url, options),
      timeoutPromise
    ]);

    const lhr = runnerResult.lhr;

    const result = {
      scores: {
        performance: Math.round((lhr.categories.performance.score || 0) * 100),
        accessibility: Math.round((lhr.categories.accessibility.score || 0) * 100),
        bestPractices: Math.round((lhr.categories['best-practices'].score || 0) * 100),
        seo: Math.round((lhr.categories.seo.score || 0) * 100)
      },
      report: lhr,
      fetchedAt: new Date()
    };
    console.log("[lighthouse] audit complete");
    return result;
  } finally {
    console.log("[lighthouse] closing chrome");
    await chrome.kill();
  }
}

module.exports = { runLighthouse };

