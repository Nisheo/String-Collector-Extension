# JavaScript Module Structure

This directory contains the modularized JavaScript code for the GitHub String Collector extension.

## Module Overview

### 📄 `popup.js`
**Main Entry Point**
- Handles initialization and event listeners
- Orchestrates interaction between other modules
- Manages application state

### 🛠️ `utils.js`
**Utility Functions**
- `escapeHtml()` - Sanitizes HTML content
- `showButtonFeedback()` - Shows temporary button state changes
- `countByStatus()` - Counts strings by their status
- `generateStatusText()` - Creates formatted status messages

### 📝 `formatter.js`
**Data Formatting**
- `generateMarkdownTable()` - Converts string data to Markdown table format

### 🎨 `ui-renderer.js`
**UI Rendering**
- `renderEmptyState()` - Creates empty state UI
- `renderDataTable()` - Generates HTML table for string data
- `generateStatusBadge()` - Creates status badge HTML
- `generateValueCell()` - Formats value cells based on status

### 🔍 `github-diff-collector.js`
**GitHub Pull Request Parsing**
- `collectGitHubPage()` - Fetches the authenticated pull request diff
- Filters changes to approved localization file paths
- Parses Android XML and Apple `.strings` entries
- Builds added, modified, and deleted string results

## Module Dependencies

```
popup.js
├── utils.js
├── formatter.js
├── ui-renderer.js
│   └── utils.js
└── github-diff-collector.js
```

## Architecture

The code follows a modular architecture with clear separation of concerns:

1. **Presentation Layer** (`ui-renderer.js`) - Handles all UI rendering
2. **Business Logic Layer** (`github-diff-collector.js`) - Core diff parsing and collection logic
3. **Utility Layer** (`utils.js`, `formatter.js`) - Reusable helper functions
4. **Application Layer** (`popup.js`) - Orchestrates everything together

## Benefits

- ✅ **Better Readability** - Each module has a single responsibility
- ✅ **Easier Maintenance** - Changes are isolated to specific modules
- ✅ **Testability** - Individual functions can be tested in isolation
- ✅ **Reusability** - Utility functions can be used across modules
- ✅ **Scalability** - Easy to add new features without bloating existing files
