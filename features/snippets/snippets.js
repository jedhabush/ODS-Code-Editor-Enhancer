
(function () {
    // console.log('✅ SnippetFeature loading...');

    window.SnippetFeature = {
        snippets: window.snippetsSchema.snippets,
        enabled: true,

        setEnabled(isEnabled) {
            this.enabled = isEnabled;
            // console.log('Snippet feature enabled:', isEnabled);
        },

        // Add a new snippet dynamically
        addSnippet(trigger, template, description) {
            this.snippets[trigger] = { template, description };
            // console.log(`✅ Added snippet: ${trigger}`);
        },

        setup(cm) {
            if (!this.enabled) return;

            // Listen for Enter key
            cm.on('keydown', (instance, event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
                    const cursor = instance.getCursor();
                    const line = instance.getLine(cursor.line);

                    // Get the word before cursor
                    const textBeforeCursor = line.substring(0, cursor.ch);
                    const match = textBeforeCursor.match(/(\w+)$/);

                    if (match) {
                        const trigger = match[1];

                        if (this.snippets[trigger]) {
                            event.preventDefault();
                            this.expandSnippet(instance, trigger, cursor, match[0].length);
                            return;
                        }
                    }
                }
            });

            // console.log('✅ Snippet shortcuts enabled for this instance');
        },

        expandSnippet(cm, trigger, cursor, triggerLength) {
            const snippet = this.snippets[trigger];

            if (!snippet) return;

            // Remove the trigger word
            const from = { line: cursor.line, ch: cursor.ch - triggerLength };
            const to = cursor;

            cm.replaceRange('', from, to);

            // Split template by $CURSOR to find cursor position
            const parts = snippet.template.split('$CURSOR');
            const beforeCursor = parts[0] || '';
            const afterCursor = parts[1] || '';

            // Insert the snippet
            const fullText = beforeCursor + afterCursor;
            cm.replaceRange(fullText, from);

            // Calculate cursor position
            const lines = beforeCursor.split('\n');
            const cursorLine = from.line + lines.length - 1;
            const cursorCh = lines.length === 1
                ? from.ch + beforeCursor.length
                : lines[lines.length - 1].length;

            // Set cursor position
            cm.setCursor({ line: cursorLine, ch: cursorCh });

            // Focus the editor
            cm.focus();

            // console.log(`✨ Expanded snippet: ${trigger}`);
        },

        // Get list of all available snippets
        getSnippetList() {
            return Object.entries(this.snippets).map(([trigger, data]) => ({
                trigger,
                description: data.description,
                preview: data.template.replace('$CURSOR', '|')
            }));
        },

        // Show available snippets in console (for debugging)
        showSnippets() {
            // console.log('📝 Available snippets:');
            this.getSnippetList().forEach(snippet => {
                // console.log(`  ${snippet.trigger} - ${snippet.description}`);
                // console.log(`    ${snippet.preview}`);
            });
        }
    };

    // Show available snippets on load
    window.SnippetFeature.showSnippets();

    // console.log('✅ SnippetFeature loaded');
})();