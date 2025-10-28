// features/comment-toggle.js
(function () {
    // console.log('✅ CommentToggleFeature loading...');

    // Comment syntax by language/mode
    const commentSyntax = {
        'javascript': { line: '//', block: { start: '/*', end: '*/' } },
        'jsx': { line: '//', block: { start: '/*', end: '*/' } },
        'typescript': { line: '//', block: { start: '/*', end: '*/' } },
        'css': { block: { start: '/*', end: '*/' } },
        'scss': { line: '//', block: { start: '/*', end: '*/' } },
        'html': { block: { start: '<!--', end: '-->' } },
        'xml': { block: { start: '<!--', end: '-->' } },
        'text/html': { block: { start: '<!--', end: '-->' } },
        'text/css': { block: { start: '/*', end: '*/' } },
        'python': { line: '#' },
        'ruby': { line: '#' },
        'php': { line: '//', block: { start: '/*', end: '*/' } },
        'sql': { line: '--', block: { start: '/*', end: '*/' } },
        'shell': { line: '#' },
        'yaml': { line: '#' },
        'default': { line: '//', block: { start: '/*', end: '*/' } }
    };

    window.CommentToggleFeature = {
        enabled: true,

        setEnabled(isEnabled) {
            this.enabled = isEnabled;
            // console.log('Comment toggle feature enabled:', isEnabled);
        },

        setup(cm) {
            if (!this.enabled) return;

            // Listen for Ctrl/Cmd + /
            cm.on('keydown', (instance, event) => {
                if (!this.enabled) return;

                // Check for Ctrl+/ (Windows/Linux) or Cmd+/ (Mac)
                const isCommentShortcut = (event.ctrlKey || event.metaKey) &&
                    event.key === '/' &&
                    !event.shiftKey &&
                    !event.altKey;

                if (isCommentShortcut) {
                    event.preventDefault();
                    this.toggleComment(instance);
                }
            });

            // console.log('✅ Comment toggle (Ctrl/Cmd + /) enabled for this instance');
        },

        toggleComment(cm) {
            const selections = cm.listSelections();

            if (selections.length === 0) return;

            // Get the mode/language
            const mode = this.getMode(cm);
            const syntax = commentSyntax[mode] || commentSyntax['default'];

            // Determine line range for all selections
            const lineRanges = selections.map(sel => {
                const from = Math.min(sel.anchor.line, sel.head.line);
                const to = Math.max(sel.anchor.line, sel.head.line);
                return { from, to };
            });

            // Check if all lines are commented
            const allCommented = this.areAllLinesCommented(cm, lineRanges, syntax);

            cm.operation(() => {
                if (allCommented) {
                    this.uncommentLines(cm, lineRanges, syntax);
                } else {
                    this.commentLines(cm, lineRanges, syntax);
                }
            });

            // console.log(`✨ ${allCommented ? 'Uncommented' : 'Commented'} code`);
            // console.log(mode, "MOOODE COOODE");
        },

        getMode(cm) {
            try {
                const mode = cm.getOption('mode');
                if (typeof mode === 'string') {
                    return mode;
                } else if (mode && mode.name) {
                    return mode.name;
                }
            } catch (e) {
                console.warn('Could not detect mode:', e);
            }
            return 'default';
        },

        areAllLinesCommented(cm, lineRanges, syntax) {
            // Use line comments if available, otherwise use block comments
            if (syntax.line) {
                const commentPrefix = syntax.line;

                for (const range of lineRanges) {
                    for (let i = range.from; i <= range.to; i++) {
                        const line = cm.getLine(i);
                        const trimmed = line.trim();

                        // Skip empty lines
                        if (trimmed === '') continue;

                        // If any non-empty line is not commented, return false
                        if (!trimmed.startsWith(commentPrefix)) {
                            return false;
                        }
                    }
                }
                return true;
            } else if (syntax.block) {
                // Check if selection is wrapped in block comments
                for (const range of lineRanges) {
                    const firstLine = cm.getLine(range.from).trim();
                    const lastLine = cm.getLine(range.to).trim();

                    if (!firstLine.startsWith(syntax.block.start) || !lastLine.endsWith(syntax.block.end)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },

        commentLines(cm, lineRanges, syntax) {
            // Prefer line comments if available
            if (syntax.line) {
                const commentPrefix = syntax.line + ' ';

                // Process each line range
                lineRanges.forEach(range => {
                    for (let i = range.from; i <= range.to; i++) {
                        const line = cm.getLine(i);

                        // Skip empty lines
                        if (line.trim() === '') continue;

                        // Find first non-whitespace character
                        const match = line.match(/^\s*/);
                        const indent = match ? match[0] : '';

                        // Insert comment after indentation
                        cm.replaceRange(
                            commentPrefix,
                            { line: i, ch: indent.length },
                            { line: i, ch: indent.length }
                        );
                    }
                });
            } else if (syntax.block) {
                // Use block comments
                lineRanges.forEach(range => {
                    const firstLine = cm.getLine(range.from);
                    const lastLine = cm.getLine(range.to);

                    // Get indentation of first line
                    const match = firstLine.match(/^\s*/);
                    const indent = match ? match[0] : '';

                    // Add opening comment at start of first line
                    cm.replaceRange(
                        syntax.block.start + ' ',
                        { line: range.from, ch: indent.length },
                        { line: range.from, ch: indent.length }
                    );

                    // Add closing comment at end of last line
                    const lastLineLength = cm.getLine(range.to).length;
                    cm.replaceRange(
                        ' ' + syntax.block.end,
                        { line: range.to, ch: lastLineLength },
                        { line: range.to, ch: lastLineLength }
                    );
                });
            }
        },

        uncommentLines(cm, lineRanges, syntax) {
            // Prefer line comments if available
            if (syntax.line) {
                const commentPrefix = syntax.line;

                // Process each line range
                lineRanges.forEach(range => {
                    for (let i = range.from; i <= range.to; i++) {
                        const line = cm.getLine(i);
                        const trimmed = line.trim();

                        // Skip empty lines
                        if (trimmed === '') continue;

                        // Check if line is commented
                        if (trimmed.startsWith(commentPrefix)) {
                            // Find the comment prefix position
                            const commentIndex = line.indexOf(commentPrefix);

                            // Remove comment prefix and optional space after it
                            const charsToRemove = line[commentIndex + commentPrefix.length] === ' '
                                ? commentPrefix.length + 1
                                : commentPrefix.length;

                            cm.replaceRange(
                                '',
                                { line: i, ch: commentIndex },
                                { line: i, ch: commentIndex + charsToRemove }
                            );
                        }
                    }
                });
            } else if (syntax.block) {
                // Use block comments
                lineRanges.forEach(range => {
                    const firstLine = cm.getLine(range.from);
                    const lastLine = cm.getLine(range.to);

                    // Remove opening comment from first line
                    const startIndex = firstLine.indexOf(syntax.block.start);
                    if (startIndex !== -1) {
                        const charsToRemove = firstLine[startIndex + syntax.block.start.length] === ' '
                            ? syntax.block.start.length + 1
                            : syntax.block.start.length;

                        cm.replaceRange(
                            '',
                            { line: range.from, ch: startIndex },
                            { line: range.from, ch: startIndex + charsToRemove }
                        );
                    }

                    // Remove closing comment from last line (need to get it again as positions changed)
                    const updatedLastLine = cm.getLine(range.to);
                    const endIndex = updatedLastLine.lastIndexOf(syntax.block.end);
                    if (endIndex !== -1) {
                        const spaceBeforeEnd = updatedLastLine[endIndex - 1] === ' ' ? 1 : 0;

                        cm.replaceRange(
                            '',
                            { line: range.to, ch: endIndex - spaceBeforeEnd },
                            { line: range.to, ch: endIndex + syntax.block.end.length }
                        );
                    }
                });
            }
        }
    };

    // console.log('✅ CommentToggleFeature loaded');
})();