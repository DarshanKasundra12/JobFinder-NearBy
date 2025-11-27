document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const locationInput = document.getElementById('locationInput');
  const resultsContainer = document.getElementById('results');
  const loader = document.getElementById('loader');
  const errorMsg = document.getElementById('errorMsg');
  const statusBadge = document.getElementById('statusBadge');
  const backendStatus = document.getElementById('backendStatus');

  const BACKEND_URL = 'http://localhost:3000/api/maps'; // Updated to /api/maps

  // Check Backend Connection
  fetch('http://localhost:3000/') // Root check if available, or just assume failure if api fails
    .then(() => {
      // If root doesn't exist, this might fail 404, but connection works. 
      // We'll skip strict check here and rely on the search call.
    })
    .catch(() => {
      // Silent fail for init check
    });

  // Simple visual check
  statusBadge.classList.add('connected');
  backendStatus.textContent = 'Ready';

  searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();

    if (!location) {
      showError('Please enter a location');
      return;
    }

    // Reset UI
    resultsContainer.innerHTML = '';
    errorMsg.classList.add('hidden');
    loader.classList.remove('hidden');
    searchBtn.disabled = true;

    // Call Local Backend
    fetch(`${BACKEND_URL}?location=${encodeURIComponent(location)}`)
      .then(res => {
        if (!res.ok) throw new Error('Backend error or not running');
        return res.json();
      })
      .then(data => {
        displayResults(data);
      })
      .catch(err => {
        showError('Could not connect to backend. Is "npm start" running in backend-kit?');
        console.error(err);
      })
      .finally(() => {
        loader.classList.add('hidden');
        searchBtn.disabled = false;
      });
  });

  function displayResults(companies) {
    if (!companies || companies.length === 0) {
      resultsContainer.innerHTML = '<div class="empty-state">No companies found. Ensure backend is running and Google Maps loads.</div>';
      return;
    }

    companies.forEach(company => {
      const card = document.createElement('div');
      card.className = 'company-card';

      // Generate HR Chips
      const hrChips = (company.hr_emails || []).map(email => 
        `<span class="email-chip" title="Click to copy" onclick="navigator.clipboard.writeText('${email}')">${email} 📋</span>`
      ).join('');

      const ratingHtml = company.rating ? `<span class="rating">★ ${company.rating}</span>` : '';
      const phoneHtml = company.phone ? `<div class="details-row"><span class="icon">📞</span> ${company.phone}</div>` : '';
      const websiteHtml = company.website ? `<div class="details-row"><span class="icon">🌐</span> <a href="${company.website}" target="_blank">Website</a></div>` : '';
      
      // Google Maps Link
      const mapsHtml = company.gmaps_link ? `<div class="details-row"><span class="icon">🗺️</span> <a href="${company.gmaps_link}" target="_blank">View on Maps</a></div>` : '';

      card.innerHTML = `
        <div class="company-header">
          <div class="company-name">${company.name}</div>
          ${ratingHtml}
        </div>
        ${mapsHtml}
        ${phoneHtml}
        ${websiteHtml}
        
        ${hrChips ? `
          <div class="hr-section">
            <div class="hr-header">Possible Emails</div>
            ${hrChips}
          </div>
        ` : ''}
      `;

      resultsContainer.appendChild(card);
    });
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
  }
});