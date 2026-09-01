/**
 * Utility functions for the GitHub String Collector extension
 */

/**
 * Escapes HTML special characters in text
 * @param {string} text - The text to escape
 * @returns {string} - HTML-escaped text
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Shows a success feedback on a button temporarily
 * @param {HTMLElement} button - The button element
 * @param {string} successText - Text to show on success
 * @param {string} successColor - Background color for success state
 * @param {number} duration - Duration in milliseconds
 */
export function showButtonFeedback(button, successText, successColor, duration = 2000) {
    const originalText = button.textContent;
    const originalBg = button.style.background;
    const originalColor = button.style.color;
    
    button.textContent = successText;
    button.style.background = successColor;
    button.style.color = "white";
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = originalBg;
        button.style.color = originalColor;
    }, duration);
}

/**
 * Counts strings by status
 * @param {Array} strings - Array of string objects with status property
 * @returns {Object} - Object with counts for added, modified, and deleted
 */
export function countByStatus(strings) {
    return {
        added: strings.filter(s => s.status === 'added').length,
        modified: strings.filter(s => s.status === 'modified').length,
        deleted: strings.filter(s => s.status === 'deleted').length
    };
}

/**
 * Generates a status text summary
 * @param {number} totalStrings - Total number of strings
 * @param {Object} counts - Counts object with added, modified, deleted
 * @returns {string} - Formatted status text
 */
export function generateStatusText(totalStrings, counts) {
    let statusText = `Found ${totalStrings} string${totalStrings === 1 ? '' : 's'}`;
    if (totalStrings > 0) {
        const parts = [];
        if (counts.added > 0) parts.push(`${counts.added} added`);
        if (counts.modified > 0) parts.push(`${counts.modified} modified`);
        if (counts.deleted > 0) parts.push(`${counts.deleted} deleted`);
        statusText += ` (${parts.join(', ')})`;
    }
    return statusText;
}
