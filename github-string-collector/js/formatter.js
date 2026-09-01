/**
 * Formatting functions for converting data to different formats
 */

/**
 * Generates a Markdown table from strings data
 * @param {Array} strings - Array of string objects with key, value, status properties
 * @returns {string} - Markdown formatted table
 */
export function generateMarkdownTable(strings) {
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
