/**
 * Collects localization changes from an authenticated GitHub pull request diff.
 * This runs in the extension context so GitHub's patch-diff redirect is allowed.
 * @param {string} pageUrl - Current GitHub pull request URL
 * @param {string[]} targetFilePaths - Allowed repository path suffixes
 * @param {string} pageTitle - Current GitHub pull request title
 * @returns {Promise<Object>} Collected strings and source metadata
 */
export async function collectGitHubPage(pageUrl, targetFilePaths, pageTitle = "") {
    function parseStringEntry(text) {
        let match = text.match(/<string\s+name="([^"]+)">([^<]*)<\/string>/);
        if (match) {
            return [match[1], match[2]];
        }

        match = text.match(/<string\s+name="([^"]+)"><!\[CDATA\[(.*?)\]\]><\/string>/);
        if (match) {
            return [match[1], match[2]];
        }

        match = text.match(/"((?:\\.|[^"\\])*)"\s*=\s*"((?:\\.|[^"\\])*)"\s*;/);
        return match ? [match[1], match[2]] : null;
    }

    function normalizePath(path) {
        return path
            .replace(/^"|"$/g, "")
            .replace(/^[ab]\//, "")
            .trim();
    }

    function isTargetFile(path) {
        const normalizedPath = normalizePath(path);

        return targetFilePaths.some(targetPath =>
            normalizedPath === targetPath ||
            normalizedPath.endsWith(`/${targetPath}`)
        );
    }

    function getPullRequestDiffUrl() {
        const url = new URL(pageUrl);
        const pullRequestMatch = url.pathname.match(
            /^(\/[^/]+\/[^/]+\/pull\/\d+)/
        );

        if (!pullRequestMatch) {
            throw new Error("Open a GitHub pull request before collecting strings.");
        }

        return `${url.origin}${pullRequestMatch[1]}.diff`;
    }

    function buildFinalStrings(addedStrings, deletedStrings) {
        const finalStrings = [];
        const allKeys = new Set([...addedStrings.keys(), ...deletedStrings.keys()]);

        allKeys.forEach(key => {
            const wasAdded = addedStrings.has(key);
            const wasDeleted = deletedStrings.has(key);

            if (wasAdded && wasDeleted) {
                finalStrings.push({
                    key,
                    value: addedStrings.get(key),
                    oldValue: deletedStrings.get(key),
                    status: "modified"
                });
            } else if (wasAdded) {
                finalStrings.push({
                    key,
                    value: addedStrings.get(key),
                    status: "added"
                });
            } else {
                finalStrings.push({
                    key,
                    value: deletedStrings.get(key),
                    status: "deleted"
                });
            }
        });

        return finalStrings;
    }

    const diffUrl = getPullRequestDiffUrl();
    const response = await fetch(diffUrl, {
        credentials: "include",
        headers: {
            Accept: "application/vnd.github.v3.diff"
        }
    });

    if (!response.ok) {
        throw new Error(`GitHub diff request failed (${response.status}).`);
    }

    const diffText = await response.text();
    if (/^\s*<!doctype html/i.test(diffText)) {
        throw new Error("GitHub returned HTML instead of the PR diff. Check your sign-in session.");
    }

    const addedStrings = new Map();
    const deletedStrings = new Map();
    const matchedFiles = new Set();
    let currentFilePath = "";
    let insideHunk = false;

    diffText.split("\n").forEach(line => {
        if (line.startsWith("diff --git ")) {
            currentFilePath = "";
            insideHunk = false;
            return;
        }

        if (line.startsWith("+++ ")) {
            currentFilePath = normalizePath(line.slice(4));
            if (isTargetFile(currentFilePath)) {
                matchedFiles.add(currentFilePath);
            }
            return;
        }

        if (line.startsWith("@@")) {
            insideHunk = true;
            return;
        }

        if (!insideHunk || !isTargetFile(currentFilePath)) {
            return;
        }

        if (line.startsWith("+") && !line.startsWith("+++")) {
            const parsed = parseStringEntry(line.slice(1));
            if (parsed) {
                addedStrings.set(parsed[0], parsed[1]);
            }
        } else if (line.startsWith("-") && !line.startsWith("---")) {
            const parsed = parseStringEntry(line.slice(1));
            if (parsed) {
                deletedStrings.set(parsed[0], parsed[1]);
            }
        }
    });

    const finalStrings = buildFinalStrings(addedStrings, deletedStrings);

    return {
        url: pageUrl,
        title: pageTitle,
        strings: finalStrings,
        totalStrings: finalStrings.length,
        debug: [
            `Source: ${diffUrl}`,
            `Matched target files: ${matchedFiles.size}`,
            ...matchedFiles
        ]
    };
}