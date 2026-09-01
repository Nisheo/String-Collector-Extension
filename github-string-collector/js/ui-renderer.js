/**
 * UI rendering functions for displaying data in the extension popup
 */

import { escapeHtml } from './utils.js';

/**
 * Renders an empty state message
 * @returns {string} - HTML for empty state
 */
export function renderEmptyState() {
    return `
        <div class="empty-state">
            <p><strong>No XML strings found in added lines.</strong></p>
            <p style="font-size: 11px; margin-top: 8px;">Make sure you're on the Files changed tab with visible diffs.</p>
        </div>
    `;
}

/**
 * Generates a status badge HTML
 * @param {string} status - Status type (added, modified, deleted)
 * @returns {string} - HTML for status badge
 */
function generateStatusBadge(status) {
    const badges = {
        'added': '<span class="badge badge-added">Add</span>',
        'modified': '<span class="badge badge-modified">Mod</span>',
        'deleted': '<span class="badge badge-deleted">Del</span>'
    };
    return badges[status] || '';
}

/**
 * Generates value cell content based on status
 * @param {Object} str - String object with value, oldValue, and status
 * @returns {string} - HTML for value cell
 */
function generateValueCell(str) {
    const escapedValue = escapeHtml(str.value);
    
    if (str.status === 'modified') {
        const escapedOldValue = escapeHtml(str.oldValue);
        return `
            <div class="old-value">Old: ${escapedOldValue}</div>
            <div class="new-value">New: ${escapedValue}</div>
        `;
    }
    
    return escapedValue;
}

/**
 * Renders a data table with strings
 * @param {Array} strings - Array of string objects
 * @returns {string} - HTML for the complete table
 */
export function renderDataTable(strings) {
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
    
    strings.forEach((str) => {
        const escapedKey = escapeHtml(str.key);
        const valueCell = generateValueCell(str);
        const statusBadge = generateStatusBadge(str.status);
        
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
    
    return tableHTML;
}
