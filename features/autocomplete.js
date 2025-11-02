
(function () {
    'use strict';

    // Track autocomplete state for each CodeMirror instance
    const instanceAutocompleteState = new WeakMap();

    function initAutocompleteState(cm) {
        if (!instanceAutocompleteState.has(cm)) {
            instanceAutocompleteState.set(cm, {
                dropdown: null,
                suggestions: [],
                selectedIndex: 0,
                triggerPos: null,
                currentWord: ''
            });
        }
        return instanceAutocompleteState.get(cm);
    }

    // Get keywords from the keywords.js file if available, or use defaults
    function getKeywords() {
        // Try to get from global keywords if available
        if (window.odsKeywords && Array.isArray(window.odsKeywords)) {
            return window.odsKeywords;
        }

        // Default keywords for OpenDataSoft/HTML/JS
        return [
            'function', 'return', 'if', 'else', 'for', 'while', 'var', 'let', 'const',
            'true', 'false', 'null', 'undefined', 'this', 'new', 'class', 'extends',
            'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch',
            'throw', 'break', 'continue', 'switch', 'case', 'default',
            'div', 'span', 'p', 'a', 'img', 'input', 'button', 'form', 'table',
            'ods-dataset-context', 'ods-map', 'ods-chart', 'ods-table',
            'ng-repeat', 'ng-if', 'ng-show', 'ng-hide', 'ng-model', 'ng-click'
        ];
    }

    // Extract all words from the current document
    function extractWordsFromDocument(cm) {
        const content = cm.getValue();
        const wordRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
        const words = content.match(wordRegex) || [];

        // Return unique words
        return [...new Set(words)];
    }

    // Get all available completions (keywords + words from document)
    function getAllCompletions(cm) {
        const keywords = getKeywords();
        const documentWords = extractWordsFromDocument(cm);

        // Combine and deduplicate
        return [...new Set([...keywords, ...documentWords])];
    }

    function createDropdown(cm) {
        const wrapper = cm.getWrapperElement();

        const dropdown = document.createElement('div');
        dropdown.className = 'cm-autocomplete-dropdown';
        dropdown.style.cssText = `
        position: absolute;
        background:rgb(255, 255, 255);
        border: 1px solid #545167;
        border-radius: 4px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: none;
        min-width: 150px;
        min-height: 20px;
        top:0px !important;
      `;

        wrapper.appendChild(dropdown);
        return dropdown;
    }

    function createSuggestionItem(text, isSelected) {
        const item = document.createElement('div');
        item.className = 'cm-autocomplete-item';
        item.textContent = text;
        item.style.cssText = `
        padding: 6px 12px;
        cursor: pointer;
        color: ${isSelected ? '#eeebff' : '#a7a5b2'};
        background: ${isSelected ? '#545167' : 'transparent'};
        font-family: monospace;
        font-size: 13px;
      `;

        item.addEventListener('mouseenter', () => {
            item.style.background = '#545167';
            item.style.color = '#eeebff';
        });

        item.addEventListener('mouseleave', () => {
            if (!isSelected) {
                item.style.background = 'transparent';
                item.style.color = '#a7a5b2';
            }
        });

        return item;
    }

    function getSuggestions(cm, word) {
        if (!word || word.length < 1) return [];

        const allCompletions = getAllCompletions(cm);
        const lowerWord = word.toLowerCase();

        // Filter and sort suggestions
        const matches = allCompletions.filter(completion =>
            completion.toLowerCase().startsWith(lowerWord) && completion !== word
        );

        // Sort by length (shorter first) then alphabetically
        matches.sort((a, b) => {
            if (a.length !== b.length) return a.length - b.length;
            return a.localeCompare(b);
        });

        return matches.slice(0, 10); // Limit to 10 suggestions
    }

    function getWordAtCursor(cm) {
        const cursor = cm.getCursor();
        const line = cm.getLine(cursor.line);
        const end = cursor.ch;

        // Find word start
        let start = end;
        while (start > 0 && /[a-zA-Z0-9_$]/.test(line[start - 1])) {
            start--;
        }

        const word = line.substring(start, end);
        return { word, start, end };
    }

    // function positionDropdown(cm, state) {
    //     if (!state.dropdown || !state.triggerPos) return;

    //     // const coords = cm.cursorCoords(state.triggerPos, 'local');
    //     const coords = cm.cursorCoords();
    //     const wrapper = cm.getWrapperElement();
    //     const wrapperRect = wrapper.getBoundingClientRect();

    //     state.dropdown.style.left = `${coords.left}px`;
    //     state.dropdown.style.top = `${coords.top}px`;
    //     console.log("coords ", coords)
    //     console.log("cooords obj ", cm.cursorCoords())
    //     console.log("get cm ", cm)
    // }

    function positionDropdown(cm, state) {
        if (!state.dropdown || !state.triggerPos) return;

        // Get cursor coordinates relative to the page
        const coords = cm.cursorCoords(state.triggerPos, 'page');

        // Get the wrapper's position
        const wrapper = cm.getWrapperElement();
        const wrapperRect = wrapper.getBoundingClientRect();

        // Calculate position relative to the wrapper
        const left = coords.left - wrapperRect.left;
        const top = coords.bottom - wrapperRect.top;

        state.dropdown.style.left = `${left}px`;
        state.dropdown.style.top = `${top + 2}px`; // +2 for small gap

        // console.log("Positioned at:", { left, top, coords, wrapperRect });
    }

    // function updateDropdown(cm, state) {
    //     console.log("positionDropdown should trigger ?")
    //     if (!state.dropdown) return;

    //     state.dropdown.innerHTML = '';

    //     if (state.suggestions.length === 0) {
    //         hideDropdown(state);
    //         return;
    //     }

    //     state.suggestions.forEach((suggestion, index) => {
    //         const item = createSuggestionItem(suggestion, index === state.selectedIndex);

    //         item.addEventListener('click', () => {
    //             acceptSuggestion(cm, state, suggestion);
    //         });

    //         state.dropdown.appendChild(item);
    //     });

    //     state.dropdown.style.display = 'block';

    //     positionDropdown(cm, state);

    //     // Scroll selected item into view
    //     const selectedItem = state.dropdown.children[state.selectedIndex];
    //     if (selectedItem) {
    //         selectedItem.scrollIntoView({ block: 'nearest' });
    //     }
    // }

    function updateDropdown(cm, state) {
        if (!state.dropdown) return;

        state.dropdown.innerHTML = '';

        if (state.suggestions.length === 0) {
            hideDropdown(state);
            return;
        }

        state.suggestions.forEach((suggestion, index) => {
            const item = createSuggestionItem(suggestion, index === state.selectedIndex);

            item.addEventListener('click', () => {
                acceptSuggestion(cm, state, suggestion);
            });

            state.dropdown.appendChild(item);
        });

        state.dropdown.style.display = 'block';

        // Position dropdown after making it visible
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
            positionDropdown(cm, state);
        });

        // Scroll selected item into view
        const selectedItem = state.dropdown.children[state.selectedIndex];
        if (selectedItem) {
            selectedItem.scrollIntoView({ block: 'nearest' });
        }
    }

    function showDropdown(cm) {
        const state = initAutocompleteState(cm);

        if (!state.dropdown) {
            state.dropdown = createDropdown(cm);
        }

        const { word, start } = getWordAtCursor(cm);

        if (!word || word.length < 1) {
            hideDropdown(state);
            return;
        }

        state.currentWord = word;
        state.triggerPos = { line: cm.getCursor().line, ch: start };
        state.suggestions = getSuggestions(cm, word);
        state.selectedIndex = 0;

        // console.log("state.suggestions ", state.suggestions)
        updateDropdown(cm, state);
    }

    function hideDropdown(state) {
        if (state.dropdown) {
            state.dropdown.style.display = 'none';
        }
        state.suggestions = [];
        state.selectedIndex = 0;
        state.currentWord = '';
        state.triggerPos = null;
    }

    function acceptSuggestion(cm, state, suggestion) {
        if (!suggestion) {
            suggestion = state.suggestions[state.selectedIndex];
        }

        if (!suggestion) return;

        const cursor = cm.getCursor();
        const { word, start } = getWordAtCursor(cm);

        // Replace the current word with the suggestion
        cm.replaceRange(
            suggestion,
            { line: cursor.line, ch: start },
            { line: cursor.line, ch: cursor.ch }
        );

        hideDropdown(state);
        cm.focus();
    }

    function moveSelection(cm, direction) {
        const state = initAutocompleteState(cm);

        if (state.suggestions.length === 0) return false;

        if (direction === 'down') {
            state.selectedIndex = (state.selectedIndex + 1) % state.suggestions.length;
        } else if (direction === 'up') {
            state.selectedIndex = state.selectedIndex - 1;
            if (state.selectedIndex < 0) {
                state.selectedIndex = state.suggestions.length - 1;
            }
        }

        updateDropdown(cm, state);
        return true;
    }

    function setupAutocomplete(cm) {
        const state = initAutocompleteState(cm);

        // Show dropdown on input
        cm.on('inputRead', (instance, change) => {
            // Don't trigger on delete, paste, or undo
            if (change.origin === '+delete' || change.origin === 'paste' || change.origin === 'undo') {
                return;
            }

            // console.log("show dropdown ")
            // Small delay to let the change complete
            setTimeout(() => showDropdown(instance), 100);
        });

        // Hide dropdown when cursor moves to a different position
        // cm.on('cursorActivity', (instance) => {
        //     const { word } = getWordAtCursor(instance);

        //     // If we're no longer in the same word, hide dropdown
        //     if (word !== state.currentWord) {
        //         hideDropdown(state);
        //     }
        // });

        // Hide dropdown when cursor moves to a different position
        cm.on('cursorActivity', (instance) => {
            const state = initAutocompleteState(instance);
            const { word } = getWordAtCursor(instance);

            // If we're no longer in the same word, hide dropdown
            if (word !== state.currentWord) {
                hideDropdown(state);
            } else if (state.dropdown && state.dropdown.style.display !== 'none') {
                // If still in same word, update position
                positionDropdown(instance, state);
            }
        });


        // Update dropdown position on scroll
        cm.on("scroll", (instance) => {
            const state = initAutocompleteState(instance);
            if (state.dropdown && state.dropdown.style.display !== 'none') {
                positionDropdown(instance, state);
            }
        });

        // cm.on("scroll", (instance) => {
        //     positionDropdown(instance, state)
        // });

        // Handle keyboard shortcuts
        cm.addKeyMap({
            'Tab': function (cm) {
                const state = initAutocompleteState(cm);
                if (state.dropdown && state.dropdown.style.display !== 'none' && state.suggestions.length > 0) {
                    acceptSuggestion(cm, state);
                    // console.log("insiiiiiide the if else")
                    return true; // Prevent default Tab
                }
                // Return nothing to allow default Tab behavior
                // console.log("tabs should work normal llll", cm)
                return cm.constructor.Pass;
            },

            'Enter': function (cm) {
                const state = initAutocompleteState(cm);
                if (state.dropdown && state.dropdown.style.display !== 'none' && state.suggestions.length > 0) {
                    acceptSuggestion(cm, state);
                    return true; // Prevent default Enter
                }
                return cm.constructor.Pass;
            },

            'Esc': function (cm) {
                const state = initAutocompleteState(cm);
                if (state.dropdown && state.dropdown.style.display !== 'none' && state.suggestions.length > 0) {
                    hideDropdown(state);
                    return true; // Prevent default Esc
                }
                return cm.constructor.Pass;
            },

            'Up': function (cm) {
                const state = initAutocompleteState(cm);
                if (state.dropdown && state.dropdown.style.display !== 'none' && state.suggestions.length > 0) {
                    return moveSelection(cm, 'up'); // Prevent default Up arrow
                }
                return cm.constructor.Pass;
            },

            'Down': function (cm) {
                const state = initAutocompleteState(cm);
                if (state.dropdown && state.dropdown.style.display !== 'none' && state.suggestions.length > 0) {
                    return moveSelection(cm, 'down'); // Prevent default Down arrow
                }
                return cm.constructor.Pass;
            },

            'Ctrl-Space': function (cm) {
                showDropdown(cm);
                return true;
            },

            'Cmd-Space': function (cm) {
                showDropdown(cm);
                return true;
            }
        });

        // console.log('✅ Autocomplete enabled');
        // console.log('   • Type to see suggestions');
        // console.log('   • Tab/Enter to accept');
        // console.log('   • Ctrl/Cmd+Space to trigger manually');
    }

    // Expose to global namespace
    window.AutocompleteFeature = {
        setup: setupAutocomplete
    };

    // console.log('📦 Autocomplete module loaded');

})();

