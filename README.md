# GitHub String Collector - Microsoft Excel Online Edition

Chrome extension to collect localization strings from GitHub pull requests and automatically update Excel Online.

## Features

✅ Extract XML localization strings from GitHub PR diffs  
✅ Track Added, Modified, and Deleted strings  
✅ Beautiful table UI with color-coding  
✅ Copy as Markdown to clipboard  
✅ **Smart CSV Export with Excel merge formulas** �  
✅ **Interactive Merge Helper with VLOOKUP/XLOOKUP** 🧮

## Current Status

### ✅ Working Features:
1. Collect strings from GitHub PRs
2. Display in color-coded table (Added/Modified/Deleted)
3. Copy as Markdown format
4. Smart CSV export for Excel merge
5. Interactive merge helper with formulas

### Files:
- `manifest.json` - Extension configuration
- `popup.html` - UI with smart export buttons
- `popup.js` - Main logic with CSV export and merge helper
- `QUICK_START.md` - **2-minute workflow guide** 🚀
- `SMART_MERGE_GUIDE.md` - **Comprehensive merge tutorial** 📖

## Quick Start

### 1. Load Extension
1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this folder
5. Note your extension ID

### 2. Use Smart Merge (No Setup Needed! 🚀)

1. Go to GitHub PR with XML string changes
2. Click extension icon → "Collect Strings"
3. Click "📥 Download CSV"
4. Follow the [Smart Merge Guide](SMART_MERGE_GUIDE.md)
5. **Result:** 50+ rows merged in ~2 minutes!

**Why this is awesome:**
- ✅ No admin permissions needed
- ✅ Works immediately
- ✅ 95% time savings (30 min → 2 min)
- ✅ Formula-based accuracy

### 3. Alternative: Quick Review
- Go to any GitHub PR with XML string changes
- Click the extension icon
- Click "Collect Strings"
- View the table or copy as Markdown

## Usage

### Collect Strings from PR:
1. Open GitHub PR (Files changed tab works best)
2. Click extension icon
3. Click "Collect Strings"
4. See results in table

### Smart Excel Merge (2 minutes):

1. Click "📥 Download CSV"
2. Import CSV to Excel as "NewData" sheet
3. Click "🧮 Merge Helper" for formula
4. Use VLOOKUP/XLOOKUP to auto-merge
5. Done! See [SMART_MERGE_GUIDE.md](SMART_MERGE_GUIDE.md) for details

**Result:** 50 rows merged in 2 minutes vs 30+ minutes manual work!

### Copy to Clipboard:
- Click "Copy as Markdown"
- Paste anywhere (Excel, Google Docs, Notion, etc.)

## Button Guide

- **Blue** (Collect Strings): Main action - extracts strings from PR
- **Purple** (Copy as Markdown): Quick copy for pasting
- **Cyan** (📥 Download CSV): Smart export for Excel merge
- **Orange** (🧮 Merge Helper): Shows VLOOKUP formulas

## Requirements

- Chrome browser
- GitHub access
- Office 365 account (for Excel Online integration)
- OneDrive (where Excel file is stored)

## Time Savings Comparison

| Method | Time per PR | Automation | Setup Required |
|--------|-------------|------------|----------------|
| Manual | 30-60 min | 0% | ❌ |
| Markdown Copy | 15-20 min | 20% | ❌ |
| CSV + Formula | 2-3 min | 80% | ❌ |

## Troubleshooting

### Extension loads but no buttons appear?
- Make sure you're on a GitHub pull request page
- Click "Collect Strings" first to populate data

### CSV download not working?
- Check browser console for errors
- Ensure popup blockers aren't blocking downloads

### Merge helper formulas not working?
- Make sure sheet is named exactly "NewData"
- Check that your Excel has Key in column A, Value in column B
- Try the VLOOKUP formula instead of XLOOKUP for older Excel

### No strings found?
- Make sure you're on the "Files changed" tab in GitHub PR
- Check that the PR contains Android XML string changes
- Look for `<string name="...">` tags in the diff

## Security & Privacy

- All data stays in your browser
- No external servers (direct to GitHub and Microsoft APIs)
- OAuth tokens stored locally only
- Microsoft can revoke access anytime

## Development

To test locally:
1. Make changes
2. Go to `chrome://extensions`
3. Click reload button on this extension
4. Test in GitHub PR

## Next Steps / Ideas

**Completed:**
- ✅ CSV export for Excel merge
- ✅ Interactive merge helper with formulas
- ✅ Smart merge guide with examples

**Future Ideas:**
- [ ] Filter strings by status (Added/Modified/Deleted)
- [ ] Show which files strings came from
- [ ] Support for iOS .strings format
- [ ] Batch processing multiple PRs
- [ ] Dark mode
- [ ] Excel Power Query template
- [ ] Google Sheets integration (non-API)

---

**Made with** ❤️ **for easier localization workflows**
