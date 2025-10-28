(function () {

    'use strict';
    const instanceMultiCursorState = new WeakMap();

    function initMultiCursorState(cm) {
        if (!instanceMultiCursorState.has(cm)) {
            instanceMultiCursorState.set(cm, {
                searchTerm: null,
                currentIndex: -1,
                allMatches: []
            });
        }


        return instanceMultiCursorState.get(cm);
    }

    function findAllMatches(cm, searchTerm) {
        const matches = [];
        const doc = cm.getDoc();
        const cursor = doc.getSearchCursor(searchTerm);

        while (cursor.findNext()) {
            matches.push({
                from: { line: cursor.from().line, ch: cursor.from().ch },
                to: { line: cursor.to().line, ch: cursor.to().ch }
            });
        }

        return matches;
    }

    function selectNextOccurrence(cm) {
        const state = initMultiCursorState(cm);
        const currentSelections = cm.listSelections();

        // Get the primary selection (first one)
        const primarySelection = currentSelections[0];
        const from = cm.getCursor('from');
        const to = cm.getCursor('to');
        const selectedText = cm.getRange(from, to);


        // If nothing selected or whitespace, do nothing
        if (!selectedText || selectedText.trim().length === 0) {
            return;
        }

        // If this is a new search term, find all matches
        if (state.searchTerm !== selectedText) {
            state.searchTerm = selectedText;
            state.allMatches = findAllMatches(cm, selectedText);
            state.currentIndex = 0;

            // Find which match is currently selected
            for (let i = 0; i < state.allMatches.length; i++) {
                const match = state.allMatches[i];
                if (match.from.line === primarySelection.anchor.line &&
                    match.from.ch === primarySelection.anchor.ch) {
                    state.currentIndex = i;
                    break;
                }
            }
        }

        // If no matches or only one match (the current selection), do nothing
        if (state.allMatches.length <= 1) {
            return;
        }

        // Find the next match that's not already selected
        let nextMatchIndex = -1;
        const selectedRanges = currentSelections.map(sel => ({
            from: sel.anchor,
            to: sel.head
        }));

        // Start searching from the position after the last cursor
        const lastSelection = currentSelections[currentSelections.length - 1];
        const searchFromLine = Math.max(lastSelection.anchor.line, lastSelection.head.line);
        const searchFromCh = Math.max(lastSelection.anchor.ch, lastSelection.head.ch);

        for (let i = 0; i < state.allMatches.length; i++) {
            const match = state.allMatches[i];

            // Check if this match is after our last selection
            const isAfterLastSelection =
                match.from.line > searchFromLine ||
                (match.from.line === searchFromLine && match.from.ch >= searchFromCh);

            // Check if this match is already selected
            const isAlreadySelected = selectedRanges.some(range =>
                range.from.line === match.from.line &&
                range.from.ch === match.from.ch
            );

            if (isAfterLastSelection && !isAlreadySelected) {
                nextMatchIndex = i;
                break;
            }
        }

        // If no match found after the last cursor, wrap around to the beginning
        if (nextMatchIndex === -1) {
            for (let i = 0; i < state.allMatches.length; i++) {
                const match = state.allMatches[i];
                const isAlreadySelected = selectedRanges.some(range =>
                    range.from.line === match.from.line &&
                    range.from.ch === match.from.ch
                );

                if (!isAlreadySelected) {
                    nextMatchIndex = i;
                    break;
                }
            }
        }

        // If we found a next match, add it to selections
        if (nextMatchIndex !== -1) {
            const nextMatch = state.allMatches[nextMatchIndex];

            // Add the new selection to existing selections
            const newSelections = [...currentSelections, {
                anchor: nextMatch.from,
                head: nextMatch.to
            }];

            cm.setSelections(newSelections);

            // Scroll the new selection into view
            cm.scrollIntoView(nextMatch.to);



            // console.log(`✨ Added cursor ${currentSelections.length + 1}/${state.allMatches.length}`);
        }
    }

    function selectAllOccurrences(cm) {
        // const state = initMultiCursorState(cm);
        // const currentSelections = cm.listSelections();

        // Get the primary selection
        // const primarySelection = currentSelections[0];
        // const selectedText = cm.getRange(primarySelection.anchor, primarySelection.head);
        const from = cm.getCursor('from');
        const to = cm.getCursor('to');
        const selectedText = cm.getRange(from, to);


        // If nothing selected or whitespace, do nothing
        if (!selectedText || selectedText.trim().length === 0) {
            return;
        }

        // Find all matches
        const allMatches = findAllMatches(cm, selectedText);

        // If no matches or only one match, do nothing
        if (allMatches.length <= 1) {
            // console.log('⚠️ No additional matches found');
            return;
        }

        // Create selections for all matches
        const newSelections = allMatches.map(match => ({
            anchor: match.from,
            head: match.to
        }));

        cm.setSelections(newSelections);

        // console.log(`✨ Selected all ${allMatches.length} occurrences`);
    }

    function setupKeyboardShortcut(cm) {
        // Add keyboard shortcuts:
        // Cmd+D / Ctrl+D - Select next occurrence (like VS Code)
        // Cmd+Shift+L / Ctrl+Shift+L - Select all occurrences (like VS Code)
        // Alt+Shift+L - Alternative for select all (if Cmd+Shift+L doesn't work)
        cm.addKeyMap({
            'Cmd-D': function (cm) {
                // console.log('🔵 Cmd+D pressed');
                selectNextOccurrence(cm);
                return true; // Prevent default
            },
            'Ctrl-D': function (cm) {
                // console.log('🔵 Ctrl+D pressed');
                selectNextOccurrence(cm);
                return true;
            },
            'Shift-Cmd-D': function (cm) {
                // console.log('🟢 Cmd+Shift+D pressed');
                selectAllOccurrences(cm);
                return true;
            },
            'Shift-Ctrl-D': function (cm) {
                // console.log('🟢 Ctrl+Shift+D pressed');
                selectAllOccurrences(cm);
                return true;
            }
        });

    }

    // Expose only the setup function to global namespace
    window.MultiCursorFeature = {
        setup: setupKeyboardShortcut
    };

    // console.log('📦 Multi-cursor module loaded');


})()


