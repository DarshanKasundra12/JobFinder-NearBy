// Background Service Worker

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SEARCH_COMPANIES') {
    const { keyword, location } = message;
    
    // Construct Nominatim Query
    // Increase limit to 50 to get more results
    const query = `${keyword} in ${location}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&extratags=1&limit=50`;

    fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'CompanyFinderExtension/1.0' // Required by Nominatim
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      // Process data to extract relevant fields
      const results = data.map(item => ({
        name: item.name || item.display_name.split(',')[0], // Fallback to first part of display name
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        website: item.extratags?.website || item.extratags?.url || null
      }));
      
      sendResponse({ success: true, data: results });
    })
    .catch(error => {
      console.error('Nominatim API Error:', error);
      sendResponse({ success: false, error: 'Failed to fetch companies. Please try again.' });
    });

    return true; // Keep the messaging channel open for async response
  }
});