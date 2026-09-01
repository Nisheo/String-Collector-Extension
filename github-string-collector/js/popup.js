/**
 * Main popup script - Entry point for the extension
 */

import { countByStatus, generateStatusText, showButtonFeedback } from './utils.js';
import { generateMarkdownTable } from './formatter.js';
import { renderEmptyState, renderDataTable } from './ui-renderer.js';
import { collectGitHubPage } from './github-collector.js';

// DOM element references
const collectButton = document.getElementById("collectButton");
const copyButton = document.getElementById("copyButton");
const status = document.getElementById("status");
const output = document.getElementById("output");

// Application state
let currentData = null;

/**
 * Handles the collect button click event
 * Collects strings from the active GitHub tab
 */
async function handleCollect() {
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
            target: { tabId: tab.id },
            func: collectGitHubPage
        });

        const data = result[0].result;

        if (!data) {
            status.textContent = "No data returned.";
            return;
        }

        // Update status text
        const counts = countByStatus(data.strings);
        status.textContent = generateStatusText(data.totalStrings, counts);

        // Render output
        if (data.totalStrings === 0) {
            output.innerHTML = renderEmptyState();
        } else {
            output.innerHTML = renderDataTable(data.strings);
            
            // Store data and show copy button
            currentData = data;
            copyButton.style.display = 'block';
        }
    } catch (error) {
        console.error("Extension error:", error);
        status.textContent = "Error: " + error.message;
    }
}

/**
 * Handles the copy button click event
 * Copies data as Markdown to clipboard
 */
async function handleCopy() {
    if (!currentData || currentData.totalStrings === 0) {
        status.textContent = "No data to copy!";
        return;
    }
    
    try {
        const markdown = generateMarkdownTable(currentData.strings);
        await navigator.clipboard.writeText(markdown);
        
        showButtonFeedback(copyButton, "Copied!", "#28a745");
    } catch (error) {
        console.error("Copy error:", error);
        status.textContent = "Failed to copy: " + error.message;
    }
}

// Event listeners
collectButton.addEventListener("click", handleCollect);
copyButton.addEventListener("click", handleCopy);
