# 🚀 Maps IT Finder - Chrome Extension Setup

Follow these steps to install the Chrome Extension in your browser.

## 1️⃣ Prerequisites
- Google Chrome browser installed.
- The **Backend Server** must be running (see the `backend-kit` folder instructions).

## 2️⃣ Installation Steps
1. Open Google Chrome.
2. Type `chrome://extensions` in the address bar and press Enter.
3. Toggle **Developer mode** in the top-right corner to **ON**.
4. Click the **Load unpacked** button (top-left).
5. Select this `chrome-extension` folder.

## 3️⃣ How to Use
1. Click the **Puzzle Icon 🧩** in Chrome toolbar and pin "Maps IT Finder".
2. Click the extension icon to open it.
3. Ensure the **Backend Status** says "Connected" (Green).
4. Type a location (e.g., "Vastral", "Gota", "New York").
5. Click **Search Google Maps**.
6. Wait for the scraping process to finish (10-20 seconds).
7. View the results!

## ❓ Troubleshooting
- **Backend Status is Red?**
  - Make sure you are running `npm start` in the `backend-kit` folder.
  - Check if `http://localhost:3000` is accessible in your browser.
- **No Results?**
  - Try a different location.
  - Check the backend terminal for any errors.
