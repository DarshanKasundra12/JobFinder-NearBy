# 🚀 Vercel Deployment Guide - IT Company Finder

Your backend is now ready for Vercel deployment! Follow these simple steps to go live.

## ✅ What's Ready

Your project has been configured with:
- ✅ Modern responsive web interface (`index.html`)
- ✅ Serverless API endpoint (`api/maps.js`)
- ✅ Vercel configuration (`vercel.json`)
- ✅ Updated dependencies for serverless environment
- ✅ Automatic port fallback for local development
- ✅ CORS enabled for cross-origin requests

## 📋 Prerequisites

Before deploying, make sure you have:
1. A **GitHub account** (https://github.com)
2. A **Vercel account** (free at https://vercel.com)
3. Your repository pushed to GitHub ✅ (already done!)

## 🎯 Deployment Steps

### Step 1: Go to Vercel

Visit: https://vercel.com/new

### Step 2: Import Your Repository

1. Click **"Import Git Repository"**
2. Find and select: `DarshanKasundra12/itJOB`
3. Click **"Import"**

### Step 3: Configure Project

You'll see a "Configure Project" screen:

| Setting | Value |
|---------|-------|
| **Project Name** | `company-finder` (or your choice) |
| **Framework Preset** | `Other` |
| **Root Directory** | *(Leave as repository root – handled automatically)* |
| **Build Command** | `npm install --prefix client/public/backend-kit` *(auto from vercel.json)* |
| **Output Directory** | Leave blank |
| **Install Command** | `npm install` |

### Step 4: Deploy

Click the **"Deploy"** button and wait for the build to complete.

### Step 5: Get Your URL

Once deployed, Vercel will show you a URL like:
```
https://company-finder-xxxx.vercel.app
```

Copy this URL—it's your live backend! 🎉

## 🌐 Using Your Deployed Backend

### Web Interface
Open your URL in a browser:
```
https://company-finder-xxxx.vercel.app
```

Search for IT companies in any location!

### API Endpoint
Make requests to:
```
https://company-finder-xxxx.vercel.app/api/maps?location=San%20Francisco
```

### Update Chrome Extension
If you have the Chrome Extension, update the API base URL to your Vercel URL:
```javascript
const API_BASE_URL = 'https://company-finder-xxxx.vercel.app';
```

## 📊 Monitoring Deployment

### View Logs
1. Go to your Vercel Dashboard
2. Click your project
3. Go to "Deployments" tab
4. Click any deployment to see logs

### Monitor Usage
- Visit the "Analytics" tab to see API calls
- Check "Logs" for errors or debugging info

## 🔧 Troubleshooting

### Deployment Failed?

**Check logs on Vercel:**
1. Go to Deployments → Click the failed deployment
2. Scroll down to see error messages
3. Common issues:
   - Missing `vercel.json` - ensure the root `vercel.json` is committed
   - Missing dependencies - check `package.json` has `puppeteer-core` and `@sparticuz/chromium`

### Memory Limitations

**Hobby Plan (Free):**
- Max 1024 MB per serverless function
- Max 60 seconds execution time
- Good for light testing and development

**Pro Plan:**
- Max 3008 MB per serverless function
- Max 900 seconds execution time
- Better for production and heavy scraping

**If You Hit Memory Limits:**
1. Upgrade to **Pro Plan** (paid): Go to Vercel Dashboard → Settings → Billing → Upgrade
2. Create a **Team** on Pro Plan: https://vercel.com/teams/create
3. Redeploy your project to the Pro team

To use a Pro team after creating it:
1. Go to https://vercel.com/new
2. Select your new Pro team from the dropdown
3. Import and deploy your repository

**Current Settings:** 512 MB (Minimum - Ultra-lean for Hobby)
- Lowest possible memory allocation
- May be slower on heavy requests
- Sufficient for light company searches
- Upgrade to Pro plan if you need more performance

### API Not Working?

1. Check CORS headers are being sent (they are!)
2. Verify the location parameter: `?location=YourCity`
3. Check browser console for network errors
4. View Vercel logs for server-side errors

## 💡 Pro Tips

1. **Custom Domain**: Add your own domain in Vercel Project Settings
2. **Environment Variables**: Add secrets in Settings → Environment Variables
3. **Auto-Deploy**: Push to GitHub and Vercel auto-deploys
4. **Redeploy**: Click "Deploy" button in Vercel dashboard to rebuild
5. **Plan Comparison**: 
   - **Hobby (Free)**: 1024 MB memory, perfect for testing
   - **Pro (Paid)**: 3008 MB memory, better for production
   - Upgrade anytime in Vercel Settings

## 🎨 Customization

### Change Project Name
In Vercel Dashboard → Settings → General → rename Project Name

### Add Custom Domain
In Vercel Dashboard → Settings → Domains → add your domain

### View Deployment History
In Vercel Dashboard → Deployments tab shows all deployments

## 📱 Testing on Different Devices

Your deployed URL works on:
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Android Chrome)
- ✅ API requests from any application

## 🔒 Security Notes

- Puppeteer has headless browser limitations in serverless
- Google Maps may have rate limits on scraping
- CORS is enabled - restrict origin if needed in vercel.json

## 📞 Support

If you need help:
1. Check Vercel logs
2. Review this guide again
3. Check README.md in `client/public/backend-kit/`

## 🎉 Success!

Your IT Company Finder is now live on the internet!

**Your URL:** `https://company-finder-xxxx.vercel.app`

Share this URL to let others search for IT companies near them!

---

**Next Steps:**
- [ ] Deployed to Vercel
- [ ] Tested web interface
- [ ] Shared URL with others
- [ ] (Optional) Added custom domain
- [ ] (Optional) Updated Chrome Extension with new URL
