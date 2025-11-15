# X.com Data Extractor - Installation & Usage Guide

## 🎉 Build Status: ✅ SUCCESS

Your X.com Data Extractor extension is now fully built and ready to install!

---

## 📦 Installation Instructions

### Step 1: Load the Extension in Chrome

1. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/` in your Chrome browser
   - Or click the menu (⋮) → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Navigate to: `/Users/behnamebrahimi/Developer/Xtractor/x-extractor-extension/dist`
   - Click "Select" to load the extension

4. **Verify Installation**
   - You should see "X.com Data Extractor" in your extensions list
   - The extension icon should appear in your Chrome toolbar

---

## 🚀 How to Use

### Basic Extraction

1. **Navigate to X.com/Twitter**
   - Go to any X.com or Twitter page (timeline, profile, search results, etc.)

2. **Open the Extension**
   - Click the extension icon in your Chrome toolbar
   - The popup will show "X.com Data Extractor"

3. **Set Extraction Limit**
   - Choose number of posts to extract (1-1000)
   - Default is 100 posts

4. **Start Extraction**
   - Click "Start Extraction" button
   - The extension will automatically scroll and collect posts
   - Progress will be displayed: "Progress: 45 / 100"

5. **View Results**
   - Extracted posts will appear in the preview section
   - Shows author, text, and engagement metrics (likes, retweets, replies, views)

### 📊 Analytics Dashboard (NEW!)

After extracting posts:

1. **Show Analytics**
   - Click the "📊 Show Analytics" button below the post preview

2. **View Insights**
   - **Peak Hour**: See what time of day you post most
   - **Peak Day**: Discover which day of the week you're most active
   - **Time of Day Chart**: 24-hour breakdown of posting activity
   - **Day of Week Chart**: Weekly posting pattern

3. **Filter Data**
   - Use the "Time Range" dropdown to filter:
     - Last 7 Days
     - Last 30 Days
     - Last 90 Days
     - All Time

4. **Interpret Charts**
   - Hover over bars to see exact post counts and percentages
   - Peak times are highlighted in green
   - Charts show clear posting patterns

### 💾 Export Data

1. **Export to CSV**
   - Click "Export to CSV" button at the bottom
   - File downloads automatically
   - Filename format: `x-posts-YYYY-MM-DD-HHmmss.csv`

2. **CSV Contents**
   - Author handle
   - Post text
   - Timestamp (ISO 8601 format)
   - Likes, Retweets, Replies, Views
   - Media URLs (if any)

---

## ✨ Key Features

### 🔥 Anti-Detection Features
- **Human-like scrolling** with random delays (500-2000ms)
- **Scroll randomization** (200-500px with jitter)
- **Smooth scrolling** with easing functions
- **Rate limiting** with exponential backoff
- **Request throttling** (1000-3000ms between posts)
- **Long pauses** every 50 posts to avoid detection
- **Error recovery** for 429/403 rate limit responses

### 📈 Analytics Features
- 24-hour time-of-day analysis
- 7-day week analysis
- Automatic peak time detection
- Date range filtering
- Interactive charts with tooltips
- Percentage calculations
- Responsive design

### 💪 Performance
- Extracts up to **1000 posts** (increased from 100)
- 30-minute timeout for large extractions
- Viewport-based scrolling
- Memory-efficient processing

---

## 🎯 Use Cases

### Personal Analytics
- Track your posting habits
- Find your peak engagement times
- Analyze posting frequency
- Optimize posting schedule

### Research & Analysis
- Collect tweets for sentiment analysis
- Gather data for academic research
- Archive important threads
- Export data for external tools

### Content Strategy
- Identify best posting times
- Track competitor posting patterns
- Analyze trending topics
- Monitor brand mentions

---

## ⚙️ Technical Details

### Built Files
```
dist/
├── manifest.json              # Extension configuration
├── icons/                     # Extension icons
├── assets/
│   ├── popup-*.css           # Styled interface (7.5 KB)
│   └── popup-*.js            # Main application (590 KB / 142 KB gzipped)
└── src/
    ├── background/
    │   └── service-worker.js # Background script
    ├── content/
    │   └── content-script.js # Content injection (12.5 KB)
    └── popup/
        └── index.html        # Popup interface
```

### Technologies Used
- React 18.2.0
- Chart.js 4.4.8 (for analytics)
- Vite 5.0.0 (build tool)
- Chrome Extension Manifest V3

### Bundle Size
- Total: 590.65 KB (142.14 KB gzipped)
- Content Script: 12.52 KB (3.70 KB gzipped)
- Popup CSS: 7.50 KB (1.62 KB gzipped)

---

## 🐛 Troubleshooting

### Extension doesn't appear
- Make sure Developer Mode is enabled
- Verify you selected the `dist` folder, not the root folder
- Refresh the extensions page

### Extraction stops early
- Twitter may have rate limited your account
- Wait 10-15 minutes and try again
- The extension includes automatic backoff for rate limits

### No posts showing
- Make sure you're on a page with posts (timeline, profile, search)
- Scroll down manually to load some posts first
- Refresh the page and try again

### Analytics not showing
- Make sure posts have been extracted first
- Posts need valid timestamps to appear in analytics
- Try clicking "Show Analytics" button

### Charts look broken
- Ensure you have at least a few posts extracted
- Try different time ranges
- Refresh the extension popup

---

## 📝 Data Privacy

- **Local Processing**: All data extraction and processing happens locally in your browser
- **No Backend**: No data is sent to external servers
- **No Tracking**: The extension doesn't track or store your activity
- **Open Source**: All code is visible in the extension files

---

## 🔄 Updates

To update the extension after making code changes:

1. Navigate to the project directory:
   ```bash
   cd /Users/behnamebrahimi/Developer/Xtractor/x-extractor-extension
   ```

2. Rebuild:
   ```bash
   npm run build
   ```

3. Reload in Chrome:
   - Go to `chrome://extensions/`
   - Click the refresh icon on the X.com Data Extractor card

---

## 🎨 Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Post Extraction | ✅ | Extract up to 1000 posts with metadata |
| CSV Export | ✅ | Download posts as CSV file |
| Human-like Scrolling | ✅ | Avoid detection with natural behavior |
| Rate Limiting | ✅ | Handle Twitter rate limits gracefully |
| Time of Day Analytics | ✅ | 24-hour posting pattern chart |
| Day of Week Analytics | ✅ | Weekly posting pattern chart |
| Peak Time Detection | ✅ | Auto-identify peak posting times |
| Date Range Filters | ✅ | Filter by 7/30/90 days or all time |
| Responsive Design | ✅ | Works on all screen sizes |
| Error Recovery | ✅ | Handles 429/403 errors with backoff |

---

## 📊 What's New in This Version

### Version 1.0.0
- ✅ Increased extraction limit to 1000 posts (from 100)
- ✅ Added analytics dashboard with interactive charts
- ✅ Implemented human-like scrolling behavior
- ✅ Added rate limiting protection
- ✅ Added smooth scrolling with easing
- ✅ Added request throttling
- ✅ Implemented error recovery for rate limits
- ✅ Added peak time detection
- ✅ Added date range filtering
- ✅ Responsive design improvements
- ✅ Extended timeout to 30 minutes

---

## 📧 Support

If you encounter any issues:

1. Check the browser console for errors (F12 → Console)
2. Verify you're on the latest version
3. Try reloading the extension
4. Clear browser cache and try again

---

## 🎉 You're All Set!

Your X.com Data Extractor is ready to use. Head over to X.com/Twitter and start extracting posts to see your analytics!

**Happy Extracting! 📊✨**
