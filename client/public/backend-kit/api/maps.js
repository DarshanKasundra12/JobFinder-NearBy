const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

function generateHrEmails(websiteUrl) {
  if (!websiteUrl) return [];
  try {
    const urlObj = new URL(websiteUrl.startsWith('http') ? websiteUrl : `http://${websiteUrl}`);
    const hostname = urlObj.hostname.replace(/^www\./, '');
    return [
      `hr@${hostname}`,
      `careers@${hostname}`,
      `jobs@${hostname}`,
      `info@${hostname}`
    ];
  } catch (e) {
    return [];
  }
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: 'Location parameter is required' });
  }

  console.log(`🗺️  Maps Search: IT company near ${location}`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      args: await chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    const query = `IT company near ${location}`;
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}/`;
    
    console.log(`Navigate to: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for sidebar to load
    try {
      await page.waitForSelector('div[role="feed"]', { timeout: 10000 });
    } catch (e) {
      console.log("Sidebar feed selector not found, might be different layout.");
    }

    // SCROLLING: Scroll the feed div to load more results
    await page.evaluate(async () => {
      const wrapper = document.querySelector('div[role="feed"]');
      if (!wrapper) return;

      await new Promise((resolve) => {
        let totalHeight = 0;
        let distance = 1000;
        let timer = setInterval(() => {
          let scrollHeight = wrapper.scrollHeight;
          wrapper.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= 20000 || document.querySelectorAll('a.hfpxzc').length >= 20) {
            clearInterval(timer);
            resolve();
          }
        }, 200);
      });
    });
    
    // Wait for lazy load
    await new Promise(r => setTimeout(r, 2000));

    // Extract Data
    const places = await page.evaluate(() => {
      const results = [];
      const items = document.querySelectorAll('a.hfpxzc');

      items.forEach(item => {
        const url = item.href;
        const name = item.getAttribute('aria-label');
        
        let container = item.closest('div[role="article"]');
        if (!container) container = item.parentElement.parentElement;

        let text = container ? container.innerText : "";
        
        const ratingMatch = text.match(/(\d\.\d)\s*\(\d+\)/);
        const rating = ratingMatch ? ratingMatch[1] : null;

        const phoneMatch = text.match(/(\+\d{1,3}[- ]?)?(\d{2,4}[- ]?){2,4}\d{2,4}/);
        const phone = phoneMatch ? phoneMatch[0] : null;

        let website = null;
        if (container) {
             const websiteAnchor = container.querySelector('a[data-value="Website"]');
             if (websiteAnchor) website = websiteAnchor.href;
        }

        results.push({
          name: name || "Unknown",
          gmaps_link: url,
          rating,
          phone,
          address: "See Google Maps",
          website
        });
      });

      return results;
    });

    // Add HR Emails logic
    const finalResults = places.map(p => ({
      ...p,
      hr_emails: generateHrEmails(p.website)
    }));

    console.log(`✅ Found ${finalResults.length} places`);
    res.status(200).json(finalResults);

  } catch (error) {
    console.error('Scraping failed:', error);
    res.status(500).json({ error: 'Failed to fetch companies', details: error.message });
  } finally {
    if (browser) await browser.close();
  }
};
