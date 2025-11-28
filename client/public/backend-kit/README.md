# 🛠️ Maps IT Finder - Backend Setup

This is the scraping engine required for the Chrome Extension to work. It uses **Puppeteer** to browse Google Maps and extract company details.

## 🚀 Quick Start (Local Development)

### 1️⃣ Prerequisites
- **Node.js** installed on your computer.
  - Download from: [https://nodejs.org/](https://nodejs.org/) (LTS version recommended).

### 2️⃣ Installation
1. Open your terminal or command prompt.
2. Navigate to this `backend-kit` folder.
   ```bash
   cd path/to/backend-kit
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
   *(This may take a few minutes as it downloads Chrome for Puppeteer)*

### 3️⃣ Start the Server
Run the following command to start the backend:
```bash
npm start
```

You should see:
```
🚀 Maps Scraper running on http://localhost:3000
```

### 4️⃣ Access the Web Interface
Open your browser and go to: **http://localhost:3000**

You can now search for IT companies by entering a location!

## ☁️ Deploy to Vercel (Production)

### Prerequisites
- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy backend-kit to Vercel"
git push origin main
```

### Step 2: Connect to Vercel
1. Visit [vercel.com/new](https://vercel.com/new)
2. Select your GitHub repository
3. Set **Root Directory** to `client/public/backend-kit`
4. Click **Deploy**

### Step 3: Get Your Public URL
Once deployed, Vercel gives you a URL like:
```
https://your-app-name.vercel.app
```

Use this URL everywhere instead of `http://localhost:3000`

## 📖 API Endpoint

### GET `/api/maps`

**Parameters:**
- `location` (required): City or location name

**Example:**
```
GET /api/maps?location=San%20Francisco
```

**Response:**
```json
[
  {
    "name": "Company Name",
    "gmaps_link": "https://maps.google.com/...",
    "rating": "4.5",
    "phone": "+1-xxx-xxx-xxxx",
    "address": "See Google Maps",
    "website": "https://example.com",
    "hr_emails": ["hr@example.com", "careers@example.com"]
  }
]
```

## 🔍 How it Works
1. You enter a location in the web interface (or extension).
2. The server opens a hidden browser instance.
3. It goes to Google Maps and searches for "IT company near [location]".
4. It scrolls through results to load them.
5. It extracts Name, Rating, Phone, and Website.
6. It generates HR email addresses from domain names.
7. Results are displayed in the web interface or sent to the extension.

## ⚠️ Common Issues

### "Address already in use :::3000"
Port 3000 is already in use. The server will automatically try port 3001.

Or set a custom port:
```bash
# On Windows PowerShell:
$env:PORT=3001; npm start

# On macOS/Linux:
PORT=3001 npm start
```

### "Puppeteer failed to launch"
- On Linux: You may need to install system libraries: `sudo apt-get install chromium-browser`
- On Windows/Mac: Usually works out of the box

### Deployment Issues
- Check Vercel dashboard logs for errors
- Ensure all files are committed to GitHub
- Verify the root-level `vercel.json` and `api/maps.js` exist

## 📁 File Structure
```
backend-kit/
├── index.html          # Web interface
├── server.js           # Local development server
├── api/
│   └── maps.js        # Serverless function (Vercel)
├── package.json
└── README.md

*(The Vercel configuration now lives in the repository root to allow deployments without changing the project root in the dashboard.)*
```

## 💡 Technologies
- Express.js - Web framework
- Puppeteer - Browser automation
- @sparticuz/chromium - Chromium for Vercel
- CORS - Cross-origin requests
- Vanilla JavaScript - Frontend

## 📊 Vercel Plan Comparison

| Feature | Hobby (Free) | Pro (Paid) |
|---------|-------------|-----------|
| Memory per Function | 1024 MB | 3008 MB |
| Max Execution Time | 60s | 900s |
| Cost | Free | $20/mo |
| Best For | Testing & Light Use | Production & Heavy Load |

**Current Configuration:** 512 MB (Minimum for Hobby plan)
- Ultra-lean memory usage
- Ideal for free tier
- May be slower on heavy scraping requests
- Upgrade to Pro for better performance

## 4️⃣ Keep it Running
- **Do not close the terminal window.** The server needs to be running whenever you use the Chrome Extension.
- To stop the server, press `Ctrl + C` in the terminal.

## 🔍 How it Works
1. The extension sends a location to this server (e.g., "Vastral").
2. The server opens a hidden browser instance.
3. It goes to Google Maps and searches for "IT company near Vastral".
4. It scrolls through the results to load them.
5. It extracts Name, Rating, Phone, and Website.
6. It sends the data back to the extension.

## ⚠️ Common Issues
- **"Puppeteer failed to launch"**: 
  - You might need to install some system libraries if you are on Linux.
  - On Windows/Mac, it usually works out of the box.
- **Server stops immediately**:
  - Check if port 3000 is already in use by another application.
