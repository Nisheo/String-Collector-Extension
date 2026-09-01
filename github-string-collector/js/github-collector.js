/**
 * Main function to collect GitHub page data
 * This function must be self-contained because Chrome serializes and executes
 * it in the tab context when passed to chrome.scripting.executeScript.
 * @returns {Object} - Collected data with strings and metadata
 */
export function collectGitHubPage() {
    function parseStringTag(text) {
        let match = text.match(/<string\s+name="([^"]+)">([^<]*)<\/string>/);
        if (match) {
            return [match[1], match[2]];
        }

        match = text.match(/<string\s+name="([^"]+)"><!\[CDATA\[(.*?)\]\]><\/string>/);
        if (match) {
            return [match[1], match[2]];
        }

        return null;
    }

    function collectDiagnostics() {
        const debugInfo = [];

        debugInfo.push("=== DIAGNOSTICS ===");
        debugInfo.push(`Total divs: ${document.querySelectorAll("div").length}`);
        debugInfo.push(`Total tables: ${document.querySelectorAll("table").length}`);
        debugInfo.push(`Total tds: ${document.querySelectorAll("td").length}`);
        debugInfo.push(`Total pres: ${document.querySelectorAll("pre").length}`);

        const blobElements = document.querySelectorAll('[class*="blob"]');
        debugInfo.push(`Elements with 'blob' in class: ${blobElements.length}`);

        const diffElements = document.querySelectorAll('[class*="diff"]');
        debugInfo.push(`Elements with 'diff' in class: ${diffElements.length}`);

        const addElements = document.querySelectorAll('[class*="addition"]');
        debugInfo.push(`Elements with 'addition' in class: ${addElements.length}`);

        if (addElements.length > 0) {
            const sampleClasses = Array.from(addElements)
                .slice(0, 3)
                .map(el => el.className)
                .filter(c => c);
            debugInfo.push(`Sample classes: ${sampleClasses.join(", ")}`);
        }

        debugInfo.push("");
        return debugInfo;
    }

    function parseFromDOMElements(debugInfo) {
        const addedStrings = new Map();
        const deletedStrings = new Map();

        const selectors = [
            '[class*="addition"]',
            "td.blob-code.blob-code-addition",
            "td.blob-code-addition",
            ".blob-code-addition",
            "td.blob-code-inner",
            '[data-code-marker="+"]',
            'div[data-code-marker="+"]',
            ".react-code-line-contents"
        ];

        let diffLines = [];
        for (const selector of selectors) {
            diffLines = document.querySelectorAll(selector);
            if (diffLines.length > 0) {
                debugInfo.push(`Found ${diffLines.length} lines with: ${selector}`);
                break;
            }
        }

        if (diffLines.length > 0) {
            debugInfo.push("Parsing from DOM elements...");

            const additionElements = document.querySelectorAll('[class*="addition"]');
            const deletionElements = document.querySelectorAll('[class*="deletion"]');

            debugInfo.push(`Found ${additionElements.length} addition elements, ${deletionElements.length} deletion elements`);

            additionElements.forEach(line => {
                const text = line.textContent.trim();
                const parsed = parseStringTag(text);
                if (parsed) {
                    addedStrings.set(parsed[0], parsed[1]);
                }
            });

            deletionElements.forEach(line => {
                const text = line.textContent.trim();
                const parsed = parseStringTag(text);
                if (parsed) {
                    deletedStrings.set(parsed[0], parsed[1]);
                }
            });
        }

        return { addedStrings, deletedStrings, found: diffLines.length > 0 };
    }

    function parseFromRawText(debugInfo) {
        const addedStrings = new Map();
        const deletedStrings = new Map();

        debugInfo.push("No diff DOM elements found, parsing raw text...");
        debugInfo.push("");

        const bodyText = document.body.innerText;
        const lines = bodyText.split("\n");

        let foundAdditions = 0;
        let foundDeletions = 0;

        lines.forEach(line => {
            const trimmed = line.trim();

            const isAddition = line.match(/^\s*\+\s*<string/) ||
                (trimmed.startsWith("+") && trimmed.includes("<string name="));

            const isDeletion = line.match(/^\s*-\s*<string/) ||
                (trimmed.startsWith("-") && trimmed.includes("<string name="));

            if (isAddition || (trimmed.includes("<string name=") && line.includes("+") && !line.includes("-"))) {
                foundAdditions++;
                const parsed = parseStringTag(trimmed);
                if (parsed) {
                    addedStrings.set(parsed[0], parsed[1]);
                }
            }

            if (isDeletion || (trimmed.includes("<string name=") && line.includes("-") && !line.includes("+"))) {
                foundDeletions++;
                const parsed = parseStringTag(trimmed);
                if (parsed) {
                    deletedStrings.set(parsed[0], parsed[1]);
                }
            }
        });

        debugInfo.push(`Lines with '+' and '<string name=': ${foundAdditions}`);
        debugInfo.push(`Lines with '-' and '<string name=': ${foundDeletions}`);
        debugInfo.push(`Added strings: ${addedStrings.size}, Deleted strings: ${deletedStrings.size}`);

        return { addedStrings, deletedStrings };
    }

    function buildFinalStrings(addedStrings, deletedStrings) {
        const finalStrings = [];
        const allKeys = new Set([...addedStrings.keys(), ...deletedStrings.keys()]);

        allKeys.forEach(key => {
            const addedValue = addedStrings.get(key);
            const deletedValue = deletedStrings.get(key);

            if (addedValue && deletedValue) {
                finalStrings.push({
                    key: key,
                    value: addedValue,
                    oldValue: deletedValue,
                    status: "modified"
                });
            } else if (addedValue) {
                finalStrings.push({
                    key: key,
                    value: addedValue,
                    status: "added"
                });
            } else if (deletedValue) {
                finalStrings.push({
                    key: key,
                    value: deletedValue,
                    status: "deleted"
                });
            }
        });

        return finalStrings;
    }

    const debugInfo = collectDiagnostics();
    let result = parseFromDOMElements(debugInfo);

    if (!result.found) {
        result = parseFromRawText(debugInfo);
    }

    const finalStrings = buildFinalStrings(result.addedStrings, result.deletedStrings);

    return {
        url: window.location.href,
        title: document.title,
        strings: finalStrings,
        totalStrings: finalStrings.length,
        debug: debugInfo
    };
}
