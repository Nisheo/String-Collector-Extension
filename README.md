# GitHub String Collector - 

Chrome extension to collect localization strings from GitHub pull requests.

## Features

✅ Extract XML localization strings from GitHub PR diffs  
✅ Track Added, Modified, and Deleted strings   
✅ Copy as Markdown to clipboard  

## Current Status

### ✅ Working Features:
1. Collect strings from GitHub PRs
2. Display in color-coded table (Added/Modified/Deleted)
3. Copy as Markdown format

### Files:
- `manifest.json` - Extension configuration
- `popup.html` - UI with export buttons
- `popup.js` - Main logic with CSV export and merge helper

## Quick Start

### 1. Load Extension
1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this folder
5. Note your extension ID

### 2. Use Smart Merge

1. Go to GitHub PR with XML string changes
2. Click extension icon → "Collect Strings"
3. Click "Download CSV"

## Requirements

- Chrome browser
- GitHub access

## Troubleshooting

### Extension loads but no buttons appear?
- Make sure you're on a GitHub pull request page
- Click "Collect Strings" first to populate data

### CSV download not working?
- Check browser console for errors
- Ensure popup blockers aren't blocking downloads

### No strings found?
- Make sure you're on the "Files changed" tab in GitHub PR
- Check that the PR contains Android XML string changes
- Look for `<string name="...">` tags in the diff

## Development

To test locally:
1. Make changes
2. Go to `chrome://extensions`
3. Click reload button on this extension
4. Test in GitHub PR

**Future Ideas:**
- [ ] Show which files strings came from
- [ ] Support for iOS .strings format
- [ ] Batch processing multiple PRs

---
