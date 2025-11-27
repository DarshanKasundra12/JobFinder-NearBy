const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));

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

app.get('/api/maps', async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: 'Location parameter is required' });
  }

  console.log(`🗺️  Maps Search: IT company near ${location}`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 }); // Desktop view for sidebar

    const query = `IT company near ${location}`;
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}/`;
    
    console.log(`Navigate to: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for sidebar to load (role="feed")
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

          // Scroll for reasonable amount or until we have enough items
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
      const items = document.querySelectorAll('a.hfpxzc'); // Class for the main link in Maps list

      items.forEach(item => {
        const url = item.href;
        const name = item.getAttribute('aria-label');
        
        // Try to find container for text extraction
        // The structure is messy, but usually the parent's parent contains the info
        // We can also look for class 'W4Evc' (Label) or 'UAQhjd' (Rating)
        let container = item.closest('div[role="article"]');
        if (!container) container = item.parentElement.parentElement;

        let text = container ? container.innerText : "";
        
        // Extract Rating (e.g., "4.5(120)")
        const ratingMatch = text.match(/(\d\.\d)\s*\(\d+\)/);
        const rating = ratingMatch ? ratingMatch[1] : null;

        // Extract Phone (e.g., "+91 ...")
        // Simple regex for phone numbers in text
        const phoneMatch = text.match(/(\+\d{1,3}[- ]?)?(\d{2,4}[- ]?){2,4}\d{2,4}/);
        const phone = phoneMatch ? phoneMatch[0] : null;

        // Website is hard to get from list view without clicking. 
        // We will leave it null here, or user would need to click 'Visit' in extension.
        // However, sometimes the website link is in a separate anchor 'a[data-value="Website"]' inside the card.
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
          address: "See Google Maps", // Address is hard to parse reliably from list text block
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
    res.json(finalResults);

  } catch (error) {
    console.error('Scraping failed:', error);
    res.status(500).json({ error: 'Failed to fetch companies', details: error.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Maps Scraper running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    if (process.env.PORT) {
      console.error(`❌ Port ${PORT} is already in use. Set a different PORT environment variable.`);
      process.exit(1);
    }
    const nextPort = PORT + 1;
    console.log(`⚠️  Port ${PORT} is in use, trying ${nextPort}...`);
    app.listen(nextPort, () => {
      console.log(`🚀 Maps Scraper running on http://localhost:${nextPort}`);
    });
  } else {
    console.error(`❌ Server error: ${err.message}`);
    process.exit(1);
  }
});
