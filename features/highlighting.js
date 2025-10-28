(function () {
    'use strict';


    // Store markers for each instance so we can clear them
    const instanceMarkers = new WeakMap();


    function highlightMatchingText(cm) {

        // Clear previous highlights
        const markers = instanceMarkers.get(cm) || [];
        markers.forEach(marker => marker.clear());
        instanceMarkers.set(cm, []);

        // Get selected text
        const selection = cm.getSelection();

        // Only highlight if:
        // 1. Something is selected
        // 2. Selection is not empty/whitespace
        // 3. Selection is a reasonable length (not too long)
        if (!selection ||
            selection.trim().length === 0 ||
            selection.length > 100 ||
            selection.includes('\n')) {
            return;
        }

        const searchQuery = selection;
        const doc = cm.getDoc();
        const cursor = doc.getSearchCursor(searchQuery);
        const newMarkers = [];

        // Find all matches
        let matchCount = 0;
        while (cursor.findNext()) {
            matchCount++;

            // Skip the currently selected match
            const from = cursor.from();
            const to = cursor.to();
            const currentSelection = cm.listSelections()[0];

            // Check if this match is the current selection
            const isCurrent =
                from.line === currentSelection.anchor.line &&
                from.ch === currentSelection.anchor.ch &&
                to.line === currentSelection.head.line &&
                to.ch === currentSelection.head.ch;

            if (!isCurrent) {
                // Highlight this match
                const marker = doc.markText(from, to, {
                    className: 'cm-selection-match',
                    css: 'background-color: rgba(255, 200, 0, 0.3); border: 1px solid rgba(255, 150, 0, 0.5);'
                });
                newMarkers.push(marker);
            }

            // Prevent infinite loop
            if (matchCount > 1000) break;
        }

        instanceMarkers.set(cm, newMarkers);

        if (newMarkers.length > 0) {
            // console.log(`🎯 Highlighted ${newMarkers.length} matches for: "${searchQuery}"`);
        }
    }


    function initHighlight(cm) {
        if (!instanceMarkers.has(cm)) {
            instanceMarkers.set(cm, []);
        }
        // Highlight on selection change
        cm.on('cursorActivity', (instance) => {
            // highlightMatchingText(instance);

            highlightMatchingText(instance)


        });

    }



    window.HighlightTextFeature = {
        // setup: highlightMatchingText,
        setup: initHighlight,
        instanceMarkers: instanceMarkers
    }

    // console.log('📦 HighlightText module loaded');

})()