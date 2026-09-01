const collectButton = document.getElementById("collectButton");
const copyButton = document.getElementById("copyButton");
const status = document.getElementById("status");

let currentData = null;

collectButton.addEventListener("click", async function () {

    status.textContent = "Reading GitHub page...";

    try {

        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        const tab = tabs[0];

        if (!tab || !tab.id || !tab.url) {
            status.textContent = "Could not detect current page.";
            return;
        }

        if (!tab.url.includes("github.com")) {
            status.textContent = "Please open a GitHub page.";
            return;
        }

        const result = await chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },

            func: collectGitHubPage
        });

        const data = result[0].result;

        if (!data) {
            status.textContent = "No data returned.";
            return;
        }

        // Count by status
        const counts = {
            added: data.strings.filter(s => s.status === 'added').length,
            modified: data.strings.filter(s => s.status === 'modified').length,
            deleted: data.strings.filter(s => s.status === 'deleted').length
        };

        let statusText = `Found ${data.totalStrings} string${data.totalStrings === 1 ? '' : 's'}`;
        if (data.totalStrings > 0) {
            const parts = [];
            if (counts.added > 0) parts.push(`${counts.added} added`);
            if (counts.modified > 0) parts.push(`${counts.modified} modified`);
            if (counts.deleted > 0) parts.push(`${counts.deleted} deleted`);
            statusText += ` (${parts.join(', ')})`;
        }
        
        status.textContent = statusText;

        const output = document.getElementById("output");

        if (data.totalStrings === 0) {
            output.innerHTML = `
                <div class="empty-state">
                    <p><strong>No XML strings found in added lines.</strong></p>
                    <p style="font-size: 11px; margin-top: 8px;">Make sure you're on the Files changed tab with visible diffs.</p>
                </div>
            `;
        } else {
            let tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th style="width: 35%;">Key</th>
                            <th style="width: 50%;">Value</th>
                            <th style="width: 15%;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            data.strings.forEach((str) => {
                const escapedKey = escapeHtml(str.key);
                const escapedValue = escapeHtml(str.value);
                const escapedOldValue = str.oldValue ? escapeHtml(str.oldValue) : null;
                
                let statusBadge = '';
                let valueCell = '';
                
                if (str.status === 'modified') {
                    statusBadge = '<span class="badge badge-modified">Mod</span>';
                    valueCell = `
                        <div class="old-value">Old: ${escapedOldValue}</div>
                        <div class="new-value">New: ${escapedValue}</div>
                    `;
                } else if (str.status === 'added') {
                    statusBadge = '<span class="badge badge-added">Add</span>';
                    valueCell = escapedValue;
                } else if (str.status === 'deleted') {
                    statusBadge = '<span class="badge badge-deleted">Del</span>';
                    valueCell = escapedValue;
                }
                
                tableHTML += `
                    <tr class="row-${str.status}">
                        <td class="key-cell">${escapedKey}</td>
                        <td class="value-cell">${valueCell}</td>
                        <td class="status-cell">${statusBadge}</td>
                    </tr>
                `;
            });
            
            tableHTML += `
                    </tbody>
                </table>
            `;
            
            output.innerHTML = tableHTML;
            
            // Store data and show buttons
            currentData = data;
            copyButton.style.display = 'block';
        }
    } catch (error) {

        console.error("Extension error:", error);

        status.textContent =
            "Error: " + error.message;
    }
});

copyButton.addEventListener("click", async function () {
    if (!currentData || currentData.totalStrings === 0) {
        status.textContent = "No data to copy!";
        return;
    }
    
    try {
        const markdown = generateMarkdownTable(currentData.strings);
        await navigator.clipboard.writeText(markdown);
        
        // Show success feedback
        const originalText = copyButton.textContent;
        copyButton.textContent = "Copied!";
        copyButton.style.background = "#28a745";
        copyButton.style.color = "white";
        
        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.style.background = "";
            copyButton.style.color = "";
        }, 2000);
        
    } catch (error) {
        console.error("Copy error:", error);
        status.textContent = "Failed to copy: " + error.message;
    }
});

function generateMarkdownTable(strings) {
    if (strings.length === 0) {
        return "No strings found.";
    }
    
    let markdown = "| Key | Value | Status |\n";
    markdown += "|-----|-------|--------|\n";
    
    strings.forEach(str => {
        const key = str.key.replace(/\|/g, '\\|');
        let value = '';
        const status = str.status.charAt(0).toUpperCase() + str.status.slice(1);
        
        if (str.status === 'modified') {
            const oldVal = str.oldValue.replace(/\|/g, '\\|').replace(/\n/g, ' ');
            const newVal = str.value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
            value = `~~${oldVal}~~ → ${newVal}`;
        } else {
            value = str.value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
        }
        
        markdown += `| ${key} | ${value} | ${status} |\n`;
    });
    
    return markdown;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function collectGitHubPage() {

    const addedStrings = new Map();
    const deletedStrings = new Map();
    const finalStrings = [];
    const debugInfo = [];
    
    // Check what elements exist on the page
    debugInfo.push('=== DIAGNOSTICS ===');
    debugInfo.push(`Total divs: ${document.querySelectorAll('div').length}`);
    debugInfo.push(`Total tables: ${document.querySelectorAll('table').length}`);
    debugInfo.push(`Total tds: ${document.querySelectorAll('td').length}`);
    debugInfo.push(`Total pres: ${document.querySelectorAll('pre').length}`);
    
    // Look for any element with "blob" in the class
    const blobElements = document.querySelectorAll('[class*="blob"]');
    debugInfo.push(`Elements with 'blob' in class: ${blobElements.length}`);
    
    // Look for any element with "diff" in the class
    const diffElements = document.querySelectorAll('[class*="diff"]');
    debugInfo.push(`Elements with 'diff' in class: ${diffElements.length}`);
    
    // Look for any element with "addition" in the class
    const addElements = document.querySelectorAll('[class*="addition"]');
    debugInfo.push(`Elements with 'addition' in class: ${addElements.length}`);
    
    // If we found addition elements, show their class names
    if (addElements.length > 0) {
        const sampleClasses = Array.from(addElements)
            .slice(0, 3)
            .map(el => el.className)
            .filter(c => c);
        debugInfo.push(`Sample classes: ${sampleClasses.join(', ')}`);
    }
    
    debugInfo.push('');
    
    // Method 1: Try GitHub's diff table structure
    const selectors = [
        '[class*="addition"]',  // Try the generic addition class first
        'td.blob-code.blob-code-addition',
        'td.blob-code-addition',
        '.blob-code-addition',
        'td.blob-code-inner',
        '[data-code-marker="+"]',
        'div[data-code-marker="+"]',
        '.react-code-line-contents'
    ];
    
    let diffLines = [];
    for (const selector of selectors) {
        diffLines = document.querySelectorAll(selector);
        if (diffLines.length > 0) {
            debugInfo.push(`✓ Found ${diffLines.length} lines with: ${selector}`);
            break;
        }
    }
    
    // Method 2: Parse the raw text more flexibly
    if (diffLines.length === 0) {
        debugInfo.push('No diff DOM elements found, parsing raw text...');
        debugInfo.push('');
        
        const bodyText = document.body.innerText;
        const lines = bodyText.split('\n');
        
        let foundAdditions = 0;
        let foundDeletions = 0;
        
        lines.forEach(line => {
            const trimmed = line.trim();
            
            // Check for additions (lines starting with +)
            const isAddition = line.match(/^\s*\+\s*<string/) || 
                              (trimmed.startsWith('+') && trimmed.includes('<string name='));
            
            // Check for deletions (lines starting with -)
            const isDeletion = line.match(/^\s*-\s*<string/) || 
                              (trimmed.startsWith('-') && trimmed.includes('<string name='));
            
            if (isAddition || (trimmed.includes('<string name=') && line.includes('+') && !line.includes('-'))) {
                foundAdditions++;
                
                let stringMatch = trimmed.match(/<string\s+name="([^"]+)">([^<]*)<\/string>/);
                if (!stringMatch) {
                    stringMatch = trimmed.match(/<string\s+name="([^"]+)"><!\[CDATA\[(.*?)\]\]><\/string>/);
                }
                
                if (stringMatch) {
                    addedStrings.set(stringMatch[1], stringMatch[2]);
                }
            }
            
            if (isDeletion || (trimmed.includes('<string name=') && line.includes('-') && !line.includes('+'))) {
                foundDeletions++;
                
                let stringMatch = trimmed.match(/<string\s+name="([^"]+)">([^<]*)<\/string>/);
                if (!stringMatch) {
                    stringMatch = trimmed.match(/<string\s+name="([^"]+)"><!\[CDATA\[(.*?)\]\]><\/string>/);
                }
                
                if (stringMatch) {
                    deletedStrings.set(stringMatch[1], stringMatch[2]);
                }
            }
        });
        
        debugInfo.push(`Lines with '+' and '<string name=': ${foundAdditions}`);
        debugInfo.push(`Lines with '-' and '<string name=': ${foundDeletions}`);
        debugInfo.push(`Added strings: ${addedStrings.size}, Deleted strings: ${deletedStrings.size}`);
    } else {
        // Parse from DOM elements
        debugInfo.push('Parsing from DOM elements...');
        
        // First pass: collect all additions and deletions
        const additionElements = document.querySelectorAll('[class*="addition"]');
        const deletionElements = document.querySelectorAll('[class*="deletion"]');
        
        debugInfo.push(`Found ${additionElements.length} addition elements, ${deletionElements.length} deletion elements`);
        
        additionElements.forEach(line => {
            const text = line.textContent.trim();
            let stringMatch = text.match(/<string\s+name="([^"]+)">([^<]*)<\/string>/);
            if (!stringMatch) {
                stringMatch = text.match(/<string\s+name="([^"]+)"><!\[CDATA\[(.*?)\]\]><\/string>/);
            }
            if (stringMatch) {
                addedStrings.set(stringMatch[1], stringMatch[2]);
            }
        });
        
        deletionElements.forEach(line => {
            const text = line.textContent.trim();
            let stringMatch = text.match(/<string\s+name="([^"]+)">([^<]*)<\/string>/);
            if (!stringMatch) {
                stringMatch = text.match(/<string\s+name="([^"]+)"><!\[CDATA\[(.*?)\]\]><\/string>/);
            }
            if (stringMatch) {
                deletedStrings.set(stringMatch[1], stringMatch[2]);
            }
        });
    }

    // Determine status for each string
    const allKeys = new Set([...addedStrings.keys(), ...deletedStrings.keys()]);
    
    allKeys.forEach(key => {
        const addedValue = addedStrings.get(key);
        const deletedValue = deletedStrings.get(key);
        
        if (addedValue && deletedValue) {
            // Both added and deleted = modified
            finalStrings.push({
                key: key,
                value: addedValue,
                oldValue: deletedValue,
                status: 'modified'
            });
        } else if (addedValue) {
            // Only added = new string
            finalStrings.push({
                key: key,
                value: addedValue,
                status: 'added'
            });
        } else if (deletedValue) {
            // Only deleted = removed string
            finalStrings.push({
                key: key,
                value: deletedValue,
                status: 'deleted'
            });
        }
    });
    
    return {
        url: window.location.href,
        title: document.title,
        strings: finalStrings,
        totalStrings: finalStrings.length,
        debug: debugInfo
    };
}