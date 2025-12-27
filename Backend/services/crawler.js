const puppeteer = require('puppeteer');

async function fetchHtml(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    const html = await page.content();
    return { html, page };
  } finally {
    await browser.close();
  }
}

async function crawlPage(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    const data = await page.evaluate(() => {
      // Extract page title
      const title = document.title || '';
      
      // Extract meta description
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || 
                             document.querySelector('meta[property="og:description"]')?.getAttribute('content') || 
                             '';
      
      // Extract all H1 headings
      const h1Headings = Array.from(document.querySelectorAll('h1')).map(h1 => h1.textContent?.trim() || '').filter(text => text.length > 0);
      
      return { 
        title, 
        metaDescription,
        h1Headings
      };
    });

    // Get full HTML
    const html = await page.content();
    
    return { 
      ...data, 
      html 
    };
  } finally {
    await browser.close();
  }
}

module.exports = { fetchHtml, crawlPage };

