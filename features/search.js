
(function () {
    'use strict';

    // Track search state for each CodeMirror instance
    const instanceSearchState = new WeakMap();

    function initSearchState(cm) {
        if (!instanceSearchState.has(cm)) {
            instanceSearchState.set(cm, {
                query: '',
                matches: [],
                currentIndex: -1,
                markers: [],
                currentMarker: null,
                searchUI: null
            });
        }
        return instanceSearchState.get(cm);
    }

    function createSearchUI(cm) {
        const wrapper = cm.getWrapperElement();

        // Check if UI already exists
        let searchBox = wrapper.querySelector('.cm-search-box');
        if (searchBox) {
            return searchBox;
        }

        // Create search box
        searchBox = document.createElement('div');
        searchBox.className = 'cm-search-box';
        searchBox.innerHTML = `
        <div class="cm-search-container">
          <input type="text" class="cm-search-input" placeholder="Find..." />
          <span class="cm-search-counter">0 of 0</span>
          <button class="cm-search-btn cm-search-prev" title="Previous (Shift+Enter)">↑</button>
          <button class="cm-search-btn cm-search-next" title="Next (Enter)">↓</button>
          <button class="cm-search-btn cm-search-close" title="Close (Esc)">✕</button>
        </div>
      `;

        // Style the search box
        searchBox.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: #2a2734;
        border: 1px solid #545167;
        border-radius: 4px;
        padding: 8px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: none;
      `;

        const container = searchBox.querySelector('.cm-search-container');
        container.style.cssText = `
        display: flex;
        align-items: center;
        gap: 6px;
      `;

        const input = searchBox.querySelector('.cm-search-input');
        input.style.cssText = `
        background: #363342;
        border: 1px solid #545167;
        color: #eeebff;
        padding: 4px 8px;
        border-radius: 3px;
        outline: none;
        font-size: 13px;
        width: 200px;
      `;

        const counter = searchBox.querySelector('.cm-search-counter');
        counter.style.cssText = `
        color: #a7a5b2;
        font-size: 12px;
        min-width: 60px;
        text-align: center;
      `;

        const buttons = searchBox.querySelectorAll('.cm-search-btn');
        buttons.forEach(btn => {
            btn.style.cssText = `
          background: #363342;
          border: 1px solid #545167;
          color: #eeebff;
          padding: 4px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          line-height: 1;
        `;
            btn.onmouseover = () => btn.style.background = '#545167';
            btn.onmouseout = () => btn.style.background = '#363342';
        });

        wrapper.style.position = 'relative';
        wrapper.appendChild(searchBox);

        return searchBox;
    }

    function findAllMatches(cm, query) {
        if (!query) return [];

        const matches = [];
        const doc = cm.getDoc();
        const cursor = doc.getSearchCursor(query, { line: 0, ch: 0 }, { caseFold: true });

        while (cursor.findNext()) {
            matches.push({
                from: { line: cursor.from().line, ch: cursor.from().ch },
                to: { line: cursor.to().line, ch: cursor.to().ch }
            });
        }

        return matches;
    }

    function clearSearchHighlights(state) {
        // Clear all match markers
        state.markers.forEach(marker => marker.clear());
        state.markers = [];

        // Clear current marker
        if (state.currentMarker) {
            state.currentMarker.clear();
            state.currentMarker = null;
        }
    }

    function highlightMatches(cm, state) {
        clearSearchHighlights(state);

        if (!state.query || state.matches.length === 0) return;

        // Highlight all matches
        const doc = cm.getDoc();
        state.matches.forEach((match, index) => {
            const isCurrentMatch = index === state.currentIndex;
            const marker = doc.markText(match.from, match.to, {
                className: isCurrentMatch ? 'cm-search-match-current' : 'cm-search-match',
                css: isCurrentMatch
                    ? 'background-color: #ffad5c; color: #000;'
                    : 'background-color: rgba(255, 173, 92, 0.3); border: 1px solid rgba(255, 173, 92, 0.5);'
            });

            if (isCurrentMatch) {
                state.currentMarker = marker;
            } else {
                state.markers.push(marker);
            }
        });

        // Scroll to current match
        if (state.currentIndex >= 0 && state.matches[state.currentIndex]) {
            cm.scrollIntoView(state.matches[state.currentIndex].from, 100);
        }
    }

    function updateCounter(state) {
        if (!state.searchUI) return;

        const counter = state.searchUI.querySelector('.cm-search-counter');
        if (state.matches.length === 0) {
            counter.textContent = 'No matches';
        } else {
            counter.textContent = `${state.currentIndex + 1} of ${state.matches.length}`;
        }
    }

    function performSearch(cm, query) {
        const state = initSearchState(cm);
        state.query = query;
        state.matches = findAllMatches(cm, query);
        state.currentIndex = state.matches.length > 0 ? 0 : -1;

        highlightMatches(cm, state);
        updateCounter(state);
    }

    function goToNextMatch(cm) {
        const state = initSearchState(cm);
        if (state.matches.length === 0) return;

        state.currentIndex = (state.currentIndex + 1) % state.matches.length;
        highlightMatches(cm, state);
        updateCounter(state);
    }

    function goToPrevMatch(cm) {
        const state = initSearchState(cm);
        if (state.matches.length === 0) return;

        state.currentIndex = state.currentIndex - 1;
        if (state.currentIndex < 0) {
            state.currentIndex = state.matches.length - 1;
        }
        highlightMatches(cm, state);
        updateCounter(state);
    }

    function closeSearch(cm) {
        const state = initSearchState(cm);

        if (state.searchUI) {
            state.searchUI.style.display = 'none';
        }

        clearSearchHighlights(state);
        state.query = '';
        state.matches = [];
        state.currentIndex = -1;

        cm.focus();
    }

    function openSearch(cm) {
        const state = initSearchState(cm);

        // Create UI if it doesn't exist
        if (!state.searchUI) {
            state.searchUI = createSearchUI(cm);

            // Setup event listeners
            const input = state.searchUI.querySelector('.cm-search-input');
            const nextBtn = state.searchUI.querySelector('.cm-search-next');
            const prevBtn = state.searchUI.querySelector('.cm-search-prev');
            const closeBtn = state.searchUI.querySelector('.cm-search-close');

            // Input events
            input.addEventListener('input', (e) => {
                performSearch(cm, e.target.value);
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        goToPrevMatch(cm);
                    } else {
                        goToNextMatch(cm);
                    }
                } else if (e.key === 'Escape') {
                    closeSearch(cm);
                }
            });

            // Button events
            nextBtn.addEventListener('click', () => goToNextMatch(cm));
            prevBtn.addEventListener('click', () => goToPrevMatch(cm));
            closeBtn.addEventListener('click', () => closeSearch(cm));
        }

        // Show the search box
        state.searchUI.style.display = 'block';

        // Get selected text and populate search
        const selectedText = cm.getSelection();
        const input = state.searchUI.querySelector('.cm-search-input');

        if (selectedText && selectedText.trim().length > 0) {
            input.value = selectedText;
            performSearch(cm, selectedText);
        } else {
            input.value = state.query;
        }

        // Focus and select all
        input.focus();
        input.select();
    }

    function setupSearchShortcut(cm) {
        // Add keyboard shortcut for Cmd+F / Ctrl+F
        cm.addKeyMap({
            'Cmd-F': function (cm) {
                openSearch(cm);
                return true;
            },
            'Ctrl-F': function (cm) {
                openSearch(cm);
                return true;
            }
        });

        // console.log('✅ Search feature enabled (Cmd/Ctrl+F)');
    }

    // Expose to global namespace
    window.SearchFeature = {
        setup: setupSearchShortcut
    };

    // console.log('📦 Search module loaded');

})();
