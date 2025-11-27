# 🛠️ Maps IT Finder - Backend Setup

This is the scraping engine required for the Chrome Extension to work. It uses **Puppeteer** to browse Google Maps and extract company details.

## 1️⃣ Prerequisites
- **Node.js** installed on your computer.
  - Download from: [https://nodejs.org/](https://nodejs.org/) (LTS version recommended).

## 2️⃣ Installation
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

## 3️⃣ Start the Server
Run the following command to start the backend:
```bash
npm start
```

You should see:
```
🚀 Maps Scraper running on http://localhost:3000
```

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
