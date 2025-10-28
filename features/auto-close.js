// features/auto-close.js
(function () {
    // console.log('✅ AutoCloseFeature loading...');

    // Define bracket pairs
    const bracketPairs = {
        '(': ')',
        '[': ']',
        '{': '}',
        '"': '"',
        "'": "'",
        '`': '`'
    };

    // Closing brackets that should skip over if already present
    const closingBrackets = new Set([')', ']', '}', '"', "'", '`']);

    window.AutoCloseFeature = {
        enabled: true,
        bracketPairs: bracketPairs,

        setEnabled(isEnabled) {
            this.enabled = isEnabled;
            // console.log('Auto-close feature enabled:', isEnabled);
        },

        setup(cm) {
            if (!this.enabled) return;

            // Handle opening brackets
            cm.on('keydown', (instance, event) => {
                if (!this.enabled) return;

                const key = event.key;

                // Handle opening brackets
                if (bracketPairs[key] && !event.ctrlKey && !event.altKey && !event.metaKey) {
                    event.preventDefault();
                    this.handleOpeningBracket(instance, key);
                    return;
                }

                // Handle closing brackets - skip over if already present
                if (closingBrackets.has(key) && !event.ctrlKey && !event.altKey && !event.metaKey) {
                    const cursor = instance.getCursor();
                    const nextChar = instance.getRange(cursor, { line: cursor.line, ch: cursor.ch + 1 });

                    // If the next character is the same closing bracket, just skip over it
                    if (nextChar === key) {
                        event.preventDefault();
                        instance.setCursor({ line: cursor.line, ch: cursor.ch + 1 });
                        return;
                    }
                }

                // Handle backspace - delete matching closing bracket
                if (event.key === 'Backspace' && !event.ctrlKey && !event.altKey && !event.metaKey) {
                    const cursor = instance.getCursor();
                    const prevChar = instance.getRange(
                        { line: cursor.line, ch: cursor.ch - 1 },
                        cursor
                    );
                    const nextChar = instance.getRange(
                        cursor,
                        { line: cursor.line, ch: cursor.ch + 1 }
                    );

                    // If we have a matching pair, delete both
                    if (bracketPairs[prevChar] === nextChar) {
                        event.preventDefault();
                        instance.replaceRange(
                            '',
                            { line: cursor.line, ch: cursor.ch - 1 },
                            { line: cursor.line, ch: cursor.ch + 1 }
                        );
                        return;
                    }
                }
            });

            // console.log('✅ Auto-close brackets enabled for this instance');
        },

        handleOpeningBracket(cm, openChar) {
            const closeChar = bracketPairs[openChar];
            const selections = cm.listSelections();

            // Handle multiple selections/cursors
            if (selections.length === 0) return;

            // Check if there's selected text
            const hasSelection = selections.some(sel =>
                sel.anchor.line !== sel.head.line || sel.anchor.ch !== sel.head.ch
            );

            if (hasSelection) {
                // Wrap selected text with brackets
                this.wrapSelection(cm, openChar, closeChar);
            } else {
                // Insert bracket pair and position cursor between them
                this.insertBracketPair(cm, openChar, closeChar);
            }
        },

        wrapSelection(cm, openChar, closeChar) {
            const selections = cm.listSelections();
            const replacements = [];

            // Prepare all replacements
            selections.forEach(sel => {
                const from = cm.getCursor('from');
                const to = cm.getCursor('to');
                const selectedText = cm.getRange(from, to);


                // const selectedText = cm.getRange(sel.anchor, sel.head);
                // const isReversed = sel.anchor.line > sel.head.line ||
                //     (sel.anchor.line === sel.head.line && sel.anchor.ch > sel.head.ch);

                // const from = isReversed ? sel.head : sel.anchor;
                // const to = isReversed ? sel.anchor : sel.head;

                replacements.push({
                    from: from,
                    to: to,
                    text: openChar + selectedText + closeChar
                });
            });

            // Apply all replacements
            cm.operation(() => {
                replacements.forEach(rep => {
                    cm.replaceRange(rep.text, rep.from, rep.to);
                });
            });

            // console.log(`✨ Wrapped ${selections.length} selection(s) with ${openChar}${closeChar}`);
        },

        insertBracketPair(cm, openChar, closeChar) {
            const cursor = cm.getCursor();

            // Insert both brackets
            cm.replaceRange(openChar + closeChar, cursor);

            // Move cursor between the brackets
            cm.setCursor({ line: cursor.line, ch: cursor.ch + 1 });

            // console.log(`✨ Inserted bracket pair: ${openChar}${closeChar}`);
        },

        // Check if cursor is inside a string or comment (optional enhancement)
        isInStringOrComment(cm, pos) {
            const token = cm.getTokenAt(pos);
            return token.type && (
                token.type.includes('string') ||
                token.type.includes('comment')
            );
        }
    };

    // console.log('✅ AutoCloseFeature loaded');
})();