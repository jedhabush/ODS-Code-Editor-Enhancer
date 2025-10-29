// themes/themes.js

(function () {
    const themes = {
        defaultTheme: {
            name: 'Default Theme',
            styles: `  `
        },

        blackboard: {
            name: 'Blackboard',
            styles: `
        .CodeMirror { background: #0C1021 !important; color: #F8F8F8 !important; }
 div.CodeMirror-selected { background: #253B76 !important; }
 .CodeMirror-line::selection,  .CodeMirror-line > span::selection,  .CodeMirror-line > span > span::selection { background: rgba(37, 59, 118, .99) !important; }
 .CodeMirror-line::-moz-selection,  .CodeMirror-line > span::-moz-selection,  .CodeMirror-line > span > span::-moz-selection { background: rgba(37, 59, 118, .99) !important; }
 .CodeMirror-gutters { background: #0C1021; border-right: 0 !important; }
 .CodeMirror-guttermarker { color: #FBDE2D !important; }
 .CodeMirror-guttermarker-subtle { color: #888 !important; }
 .CodeMirror-linenumber { color: #888 !important; }
 .CodeMirror-cursor { border-left: 1px solid #A7A7A7 !important; }

 span.cm-keyword { color: #FBDE2D !important; }
 span.cm-atom { color: #D8FA3C !important; }
 span.cm-number { color: #D8FA3C !important; }
 span.cm-def { color: #8DA6CE !important; }
 span.cm-variable { color: #FF6400 !important; }
 span.cm-operator { color: #FBDE2D !important; }
 span.cm-comment { color: #AEAEAE !important; }
 span.cm-string { color: #61CE3C !important; }
 span.cm-string-2 { color: #61CE3C !important; }
 span.cm-meta { color: #D8FA3C !important; }
 span.cm-builtin { color: #8DA6CE !important; }
 span.cm-tag { color: #5ccfe6 !important; }
 span.cm-attribute { color: #8DA6CE !important; }
 span.cm-header { color: #FF6400 !important; }
 span.cm-hr { color: #AEAEAE !important; }
 span.cm-link { color: #8DA6CE !important; }
 span.cm-error { background: #9D1E15; color: #F8F8F8 !important; }
span.cm-qualifier { color: #5ccfe6 !important; }

 .CodeMirror-activeline-background { background: #3C3636 !important; }
 .CodeMirror-matchingbracket { outline:1px solid grey;color:white !important; }
      `
        },


        dracula: {
            name: 'Dracula',
            styles: `
         { font-family: Consolas, Menlo, Monaco, 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New', monospace, serif;}
.CodeMirror { background: #2B2B2B !important; color: #A9B7C6 !important; }

 span.cm-meta { color: #BBB529 !important; }
 span.cm-number { color: #6897BB !important; }
 span.cm-keyword { color: #CC7832 !important; line-height: 1em; font-weight: bold; }
 span.cm-def { color: #A9B7C6; font-style: italic; }
 span.cm-variable { color: #A9B7C6 !important; }
 span.cm-variable-2 { color: #A9B7C6 !important; }
 span.cm-variable-3 { color: #9876AA !important; }
 span.cm-type { color: #AABBCC; font-weight: bold; }
 span.cm-property { color: #FFC66D !important; }
 span.cm-operator { color: #A9B7C6 !important; }
 span.cm-string { color: #6A8759 !important; }
 span.cm-string-2 { color: #6A8759; }
 span.cm-comment { color: #a50 !important; font-style: italic; }
 span.cm-link { color: #CC7832 !important; }
 span.cm-atom { color: #CC7832 !important; }
 span.cm-error { color: #BC3F3C !important; }
 span.cm-tag { color: #629755 !important; font-weight: bold; font-style: italic; text-decoration: underline; }
 span.cm-qualifier { color: #629755 !important; }
 span.cm-attribute { color: #6897bb !important; }
 
 span.cm-bracket { color: #A9B7C6 !important; }
 span.cm-builtin { color: #FF9E59 !important; }
 span.cm-special { color: #FF9E59 !important; }
 span.cm-matchhighlight { color: #FFFFFF; background-color: rgba(50, 89, 48, .7) !important; font-weight: normal;}
 span.cm-searching { color: #FFFFFF; background-color: rgba(61, 115, 59, .7) !important; font-weight: normal;}

 .CodeMirror-cursor { border-left: 2px solid #A9B7C6 !important; }
 .CodeMirror-activeline-background { background: #323232 !important; }
 .CodeMirror-gutters { background: #313335 !important; border-right: 1px solid #313335 !important; }
 .CodeMirror-guttermarker { color: #FFEE80 !important; }
 .CodeMirror-guttermarker-subtle { color: #D0D0D0 !important; }
 .CodeMirrir-linenumber { color: #606366 !important; }
 .CodeMirror-matchingbracket { background-color: #3B514D; color: #FFEF28 !important !important; font-weight: bold; }

 div.CodeMirror-selected { background: #214283 !important; }

.CodeMirror-hints.darcula {
  font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
  color: #9C9E9E !important;
  background-color: #3B3E3F !important;
}

.CodeMirror-hints.darcula .CodeMirror-hint-active {
  background-color: #494D4E !important;
  color: #9C9E9E !important;
}
      `
        },



        midnight: {
            name: 'Midnight',
            styles: `
        .CodeMirror-activeline-background { background: #253540 !important; }

.CodeMirror {
    background: #0F192A;
    color: #D1EDFF;
}

 div.CodeMirror-selected { background: #314D67 !important; }
 .CodeMirror-line::selection,  .CodeMirror-line > span::selection,  .CodeMirror-line > span > span::selection { background: rgba(49, 77, 103, .99); }
 .CodeMirror-line::-moz-selection,  .CodeMirror-line > span::-moz-selection,  .CodeMirror-line > span > span::-moz-selection { background: rgba(49, 77, 103, .99); }
 .CodeMirror-gutters { background: #0F192A; border-right: 1px solid; }
 .CodeMirror-guttermarker { color: white; }
 .CodeMirror-guttermarker-subtle { color: #d0d0d0; }
 .CodeMirror-linenumber { color: #D0D0D0 !important; }
 .CodeMirror-cursor { border-left: 2px solid #F8F8F0 !important; }
 

 span.cm-comment { color: #428BDD !important; }
 span.cm-atom { color: #AE81FF !important; }
 span.cm-number { color: #D1EDFF !important; }

 span.cm-property,  span.cm-attribute { color: #A6E22E !important; }
 span.cm-keyword { color: #E83737 !important; }
 span.cm-string { color: #1DC116 !important; }

 span.cm-variable { color: #FFAA3E !important; }
 span.cm-variable-2 { color: #FFAA3E !important; }
 span.cm-def { color: #4DD !important; }
 span.cm-bracket { color: #D1EDFF !important; }
 span.cm-tag { color: #1DC116 !important; }
  span.cm-qualifier { color: #1DC116 !important; }
 
 span.cm-link { color: #AE81FF !important; }
 span.cm-error { background: #F92672; color: #F8F8F0 !important; }

 .CodeMirror-matchingbracket {
  text-decoration: underline;
  color: white !important;
}
      `
        },

        mirage: {
            name: 'Mirage',
            styles: `
        .CodeMirror { background: #1f2430 !important; color: #cbccc6 !important; }
 div.CodeMirror-selected { background: #34455a !important; }
 .CodeMirror-line::selection,  .CodeMirror-line > span::selection,  .CodeMirror-line > span > span::selection { background: #34455a; }
 .CodeMirror-line::-moz-selection,  .CodeMirror-line > span::-moz-selection,  .CodeMirror-line > span > span::-moz-selection { background: rgba(25, 30, 42, 99); }
 .CodeMirror-gutters { background: #1f2430; border-right: 0px !important; }
 .CodeMirror-guttermarker { color: white !important; }
 .CodeMirror-guttermarker-subtle { color:  rgba(112, 122, 140, 66) !important; }
 .CodeMirror-linenumber { color: rgba(61, 66, 77, 99) !important; }
 .CodeMirror-cursor { border-left: 2px solid rgb(255, 0, 76) !important;  }
.cm-fat-cursor .CodeMirror-cursor {background-color:rgba(45, 238, 11, 0.46) !important;}
 .cm-animate-fat-cursor { background-color: #a2a8a175 !important; }

 span.cm-comment { color: #5c6773; font-style:italic !important; }
 span.cm-atom { color: #ae81ff !important; }
 span.cm-number { color: #ffcc66 !important; }
 
 span.cm-comment.cm-attribute { color: #ffd580 !important; }
 span.cm-comment.cm-def { color: #d4bfff !important; }
 span.cm-comment.cm-tag { color: #5ccfe6 !important; }
 span.cm-comment.cm-type { color: #5998a6 !important; }

 span.cm-property { color: #f29e74 !important; }
 span.cm-attribute { color: #ffd580 !important; }  
 span.cm-keyword { color: #ffa759 !important; } 
 span.cm-builtin { color: #ffcc66 !important; }
 span.cm-string { color: #bae67e !important; }

 span.cm-variable { color: #cbccc6 !important; }
 span.cm-variable-2 { color: #f28779 !important; }
 span.cm-variable-3 { color: #5ccfe6 !important; }
 span.cm-type { color: #ffa759 !important; }
 span.cm-def { color: #ffd580 !important; }
 span.cm-bracket { color: rgba(92, 207, 230, 80) !important; }
 span.cm-tag { color: #5ccfe6 !important; }
 span.cm-qualifier { color: #5ccfe6 !important; }
 span.cm-header { color: #bae67e !important; }
 span.cm-link { color: #5ccfe6 !important; }
 span.cm-error { color: #ff3333 !important; } 

 .CodeMirror-activeline-background { background: #191e2a !important; }
 .CodeMirror-matchingbracket {
  text-decoration: underline;
  color: white !important;
}
      `
        }

    };

    // Create global namespace
    window.ExtensionThemes = {
        themes: themes,

        getThemeList() {
            return Object.keys(themes).map(key => ({
                id: key,
                name: themes[key].name
            }));
        },

        getTheme(themeId) {
            return themes[themeId] || themes.vscode;
        },

        currentStyleElement: null,

        applyTheme(themeId) {
            // Remove old theme
            if (this.currentStyleElement) {
                this.currentStyleElement.remove();
            }

            // Get theme
            const theme = this.getTheme(themeId);

            // Create and inject new style element
            const style = document.createElement('style');
            style.id = 'cm-extension-theme';
            style.textContent = theme.styles;
            document.head.appendChild(style);

            this.currentStyleElement = style;

            // console.log(`✅ Applied theme: ${theme.name}`);
        },

        removeTheme() {
            if (this.currentStyleElement) {
                this.currentStyleElement.remove();
                this.currentStyleElement = null;
            }
        }
    };

    // console.log('✅ ExtensionThemes loaded');

})();