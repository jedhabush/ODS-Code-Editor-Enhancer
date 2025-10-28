//  Features to do
//  1- Highlight similar words ✅ 
//  2- ctrl+d to select the next occurance with a cursor focused on the words like vs code and highlight the lines where the matched words exist ✅ 
//  3- auto-close brackets and when word is highlighted add brackets or semi-col would be added not deleting the word
//  4- quick print statement/short cut pre + enter should produce <pre> </pre>
//  5- Themes colours
//  6- suggest similar variables or words 
//  ??- Add version control to the editor
//  ??- Bring errors into a pop up without clicking inspect then console
// ???- Extend functionality to other mirrorCode IDEs

// extension/
// ├── manifest.json
// ├── popup.html
// ├── popup.js
// ├── main-script.js
// ├── isolated-script.js
// └── themes/
//     ├── themes.js          # Theme definitions
//     └── theme-manager.js   # Theme application logic
// "*://data.hawkesbury.nsw.gov.au/*"

const hostname = window.location.hostname;
const path = window.location.pathname;
const isDataPortal = hostname.startsWith('data.') || hostname.startsWith('smart.');
// const isOpenDataSoft = hostname.includes('.opendatasoft.com');
const isOpenDataSoft = path.includes('/backoffice/pages/code-editor/');



// Listen for theme changes from isolated script
window.addEventListener('message', (event) => {

    if (!isDataPortal && !isOpenDataSoft) {
        console.log("RETURNED EARLY ")
        return; // Exit early
    }

    if (event.data.type === 'APPLY_THEME') {
        if (window.ExtensionThemes) {
            window.ExtensionThemes.applyTheme(event.data.themeId);
            // console.log('✅ Theme applied:', event.data.themeId);
        } else {
            console.error('❌ ExtensionThemes not loaded yet');
        }
    }

    // if (event.data.type === 'SETTINGS_UPDATED') {
    //     updateHighlightSettings(event.data.settings);
    // }
});



// Request initial theme when ready
function requestInitialTheme() {

    if (!isDataPortal && !isOpenDataSoft) {
        return; // Exit early
    }

    if (window.ExtensionThemes) {
        // console.log('✅ ExtensionThemes is ready');
        window.postMessage({ type: 'GET_CURRENT_THEME' }, '*');
    } else {
        // console.log('⏳ Waiting for ExtensionThemes...');
        setTimeout(requestInitialTheme, 100);
    }
}

window.addEventListener('load', requestInitialTheme);

// Delete update highlight code, it has been commented out
// update themes list and fix cursor colour 
// add shortcut cheat sheet on pop up


// function updateHighlightSettings(settings) {
//     if (window.HighlightTextFeature) {
//         window.HighlightTextFeature.setEnabled(settings.highlightEnabled);
//         console.log('Highlight enabled:', settings.highlightEnabled);
//     }
// }


// console.log("Extensions is loadedddd")

// console.log('Extension loaded in MAIN world');
// console.log('Extension loaded in MAIN world');

// // Inject CSS with high priority
// function injectHighPriorityCSS() {
//     if (document.getElementById('my-extension-styles')) {
//         return;
//     }

//     const style = document.createElement('style');
//     style.id = 'my-extension-styles';
//     style.textContent = `

// .CodeMirror {
//   background: #2a2734;
//   color: #6c6783;
// }
// div.CodeMirror-selected {
//   background: #545167 !important;
// }
// .CodeMirror-gutters {
//   background: #2a2734;
//   border-right: 0px;
// }
// .CodeMirror-linenumber {
//   color: #545167;
// }

// /* begin cursor */
// .CodeMirror-cursor {
//   border-left: 1px solid #ffad5c; /* border-left: 1px solid #ffad5c80; */
//   border-right: 0.5em solid #ffad5c; /* border-right: .5em solid #ffad5c80; */
//   opacity: 0.5;
// }
// .CodeMirror-activeline-background {
//   background: #363342; /* background: #36334280;  */
//   opacity: 0.5;
// }
// .cm-fat-cursor .CodeMirror-cursor {
//   background: #ffad5c; /* background: #ffad5c80; */
//   opacity: 0.5;
// }
// /* end cursor */

// span.cm-atom,
// span.cm-number,
// span.cm-keyword,
// span.cm-variable,
// span.cm-attribute,
// span.cm-quote,
// span.cm-hr,
// span.cm-link {
//   color: #ffcc99;
// }

// span.cm-property {
//   color: #9a86fd;
// }
// span.cm-punctuation,
// span.cm-unit,
// span.cm-negative {
//   color: #e09142;
// }
// span.cm-string {
//   color: #ffb870;
// }
// span.cm-operator {
//   color: #ffad5c;
// }
// span.cm-positive {
//   color: #6a51e6;
// }

// span.cm-variable-2,
// span.cm-variable-3,
// span.cm-type,
// span.cm-string-2,
// span.cm-url {
//   color: #7a63ee;
// }
// span.cm-def,
// span.cm-tag,
// span.cm-builtin,
// span.cm-qualifier,
// span.cm-header,
// span.cm-em {
//   color: #eeebff;
// }
// span.cm-bracket,
// span.cm-comment {
//   color: #a7a5b2;
// }

// /* using #f00 red for errors, don't think any of the colorscheme variables will stand out enough, ... maybe by giving it a background-color ... */
// span.cm-error,
// span.cm-invalidchar {
//   color: #f00;
// }

// span.cm-header {
//   font-weight: normal;
// }
// .CodeMirror-matchingbracket {
//   text-decoration: underline;
//   color: #eeebff !important;
// }

//   `;

//     document.head.appendChild(style);
//     console.log('✅ Custom CSS injected');
// }

// // Inject CSS immediately
// injectHighPriorityCSS();

// Rest of your CodeMirror code...




// features need to be here 
function attachToCodeMirror(cm, label = 'CodeMirror') {

    // If not permitted domain return
    if (!isDataPortal && !isOpenDataSoft) {
        return; // Exit early
    }


    if (window.CodeMirrorFinder.trackedInstances.has(cm)) {
        return;
    }
    // if (trackedInstances.has(cm)) {
    //     return;
    // }

    // trackedInstances.add(cm);
    window.CodeMirrorFinder.trackedInstances.add(cm)

    // console.log(`✅ Attaching listeners to ${label}`);

    // Initialize marker storage for this instance
    // window.HighlightTextFeature.instanceMarkers.set(cm, []);

    // // Highlight on selection change
    // cm.on('cursorActivity', (instance) => {
    //     // highlightMatchingText(instance);
    //     if (window.HighlightTextFeature && window.HighlightTextFeature.setup) {
    //         window.HighlightTextFeature.setup(instance)
    //     } else {
    //         console.warn('⚠️ MultiCursorFeature not loaded');
    //     }
    // });

    // Also highlight on any change (in case text changes while selected)
    cm.on('change', (instance) => {
        // Small delay to let the change complete
        // setTimeout(() => highlightMatchingText(instance), 10);
        setTimeout(() => {
            if (window.MultiCursorFeature && window.MultiCursorFeature.setup) {
                window.MultiCursorFeature.setup(instance)
            } else {
                console.warn('⚠️ MultiCursorFeature not loaded');
            }

            // if (window.HighlightTextFeature && window.HighlightTextFeature.setup) {
            //     window.HighlightTextFeature.setup(cm);
            // } else {
            //     console.warn('⚠️ Selection highlighting not loaded');
            // }

        }, 10)
    });


    if (window.HighlightTextFeature && window.HighlightTextFeature.setup) {
        window.HighlightTextFeature.setup(cm);
    } else {
        console.warn('⚠️ Selection highlighting not loaded');
    }

    // console.log('✨ Selection highlighting enabled');

    // Setup multi-cursor feature (from separate module)
    if (window.MultiCursorFeature && window.MultiCursorFeature.setup) {
        window.MultiCursorFeature.setup(cm);

    } else {
        console.warn('⚠️ MultiCursorFeature not loaded');
    }

    // Setup snippet feature
    if (window.SnippetFeature && window.SnippetFeature.setup) {
        window.SnippetFeature.setup(cm);
        // console.log('✨ Snippet feature enabled');
    } else {
        // console.warn('⚠️ SnippetFeature not loaded');
    }

    // Setup auto-close feature
    if (window.AutoCloseFeature && window.AutoCloseFeature.setup) {
        window.AutoCloseFeature.setup(cm);
        // console.log('✨ Auto-close brackets enabled');
    } else {
        console.warn('⚠️ AutoCloseFeature not loaded');
    }

    // Setup comment toggle feature
    if (window.CommentToggleFeature && window.CommentToggleFeature.setup) {
        window.CommentToggleFeature.setup(cm);
        // console.log('✨ Comment toggle (Ctrl/Cmd + /) enabled');
    } else {
        console.warn('⚠️ CommentToggleFeature not loaded');
    }


}

// Start
window.CodeMirrorFinder.waitFor(() => {
    window.CodeMirrorFinder.monitor(attachToCodeMirror)
})



// waitForCodeMirror(() => { monitorCodeMirror(); });

// WORKING CODE
// 
// 
// // console.log('Extension loaded in MAIN world');

// function findCodeMirror() {
//     const elements = document.querySelectorAll('.CodeMirror');
//     if (elements.length === 0) return null;

//     const cm = [...elements].map(el => el.CodeMirror).find(cm => cm);
//     return cm;
// }

// // Track all CodeMirror instances we've seen
// const trackedInstances = new WeakSet();

// function attachToCodeMirror(cm, label = 'CodeMirror') {
//     if (trackedInstances.has(cm)) {
//         console.log(`Already tracking ${label}`);
//         return;
//     }

//     trackedInstances.add(cm);
//     console.log(`✅ Attaching listeners to ${label}`);

//     cm.on('change', (instance, changeObj) => {
//         console.log(`🔥 ${label} changed!`);
//         console.log('Origin:', changeObj.origin);
//         console.log('Content length:', instance.getValue().length);

//         // YOUR EXTENSION LOGIC HERE
//         // Example: Save to storage, analyze code, etc.
//     });

//     cm.on('cursorActivity', (instance) => {
//         const cursor = instance.getCursor();
//         console.log(`👆 Cursor at line ${cursor.line}, ch ${cursor.ch}`);
//     });

//     // Add more event listeners as needed
// }

// function monitorCodeMirror() {
//     // Check for existing instances
//     const allCMs = [...document.querySelectorAll('.CodeMirror')]
//         .map(el => el.CodeMirror)
//         .filter(cm => cm);

//     allCMs.forEach((cm, index) => {
//         attachToCodeMirror(cm, `Instance ${index}`);
//     });

//     console.log(`Found ${allCMs.length} initial CodeMirror instance(s)`);

//     // Monitor for new instances
//     const observer = new MutationObserver(() => {
//         const currentCMs = [...document.querySelectorAll('.CodeMirror')]
//             .map(el => el.CodeMirror)
//             .filter(cm => cm);

//         currentCMs.forEach((cm, index) => {
//             attachToCodeMirror(cm, `Instance ${index}`);
//         });
//     });

//     observer.observe(document.body, {
//         childList: true,
//         subtree: true,
//         attributes: true
//     });

//     console.log('🔍 Monitoring for CodeMirror instances...');
// }

// // Wait for initial CodeMirror, then start monitoring
// function waitForCodeMirror(callback, timeout = 30000) {
//     const startTime = Date.now();

//     const check = () => {
//         const cm = findCodeMirror();

//         if (cm) {
//             console.log('✓ Initial CodeMirror found');
//             callback();
//             return;
//         }

//         if (Date.now() - startTime > timeout) {
//             console.error('✗ CodeMirror not found');
//             return;
//         }

//         setTimeout(check, 200);
//     };

//     setTimeout(check, 500);
// }

// // Start
// waitForCodeMirror(() => {
//     monitorCodeMirror();
// });

///////////////////////////////////////////////////////////////////////////////////////////////////////
// function findCodeMirror() {
//     const elements = document.querySelectorAll('.CodeMirror');
//     if (elements.length === 0) return null;

//     const cm = [...elements].map(el => el.CodeMirror).find(cm => cm);
//     return cm;
// }

// function waitForCodeMirror(callback, timeout = 30000) {
//     const startTime = Date.now();
//     let checkCount = 0;

//     const check = () => {
//         checkCount++;
//         const cm = findCodeMirror();

//         if (cm) {
//             console.log(`✓ CodeMirror found after ${checkCount} checks (${Date.now() - startTime}ms)`);
//             callback(cm);
//             return;
//         }

//         if (Date.now() - startTime > timeout) {
//             console.error(`✗ CodeMirror not found after ${timeout}ms`);
//             return;
//         }

//         if (checkCount % 20 === 0) {
//             const cmElements = document.querySelectorAll('.CodeMirror').length;
//             console.log(`Check ${checkCount}: ${cmElements} CodeMirror elements`);
//         }

//         setTimeout(check, 200);
//     };

//     setTimeout(check, 500);
// }


// waitForCodeMirror((cm) => {
//     console.log('=== SUCCESS ===');

//     // Find ALL CodeMirror instances
//     const allCMs = [...document.querySelectorAll('.CodeMirror')]
//         .map(el => el.CodeMirror)
//         .filter(cm => cm);

//     console.log(`Found ${allCMs.length} CodeMirror instances`);

//     // Attach listener to ALL of them
//     allCMs.forEach((cmInstance, index) => {
//         console.log(`Attaching to instance ${index}`);

//         cmInstance.on('change', (instance, changeObj) => {
//             console.log(`🔥 Instance ${index} changed!`);
//             console.log('Origin:', changeObj.origin);
//             console.log('New content length:', instance.getValue().length);
//         });
//     });

//     // Also monitor for NEW CodeMirror instances being created
//     const observer = new MutationObserver(() => {
//         const newCMs = [...document.querySelectorAll('.CodeMirror')]
//             .map(el => el.CodeMirror)
//             .filter(cm => cm && !allCMs.includes(cm));

//         if (newCMs.length > 0) {
//             console.log(`🆕 ${newCMs.length} new CodeMirror instance(s) detected!`);
//             newCMs.forEach((newCM, index) => {
//                 allCMs.push(newCM);
//                 newCM.on('change', (instance, changeObj) => {
//                     console.log(`🔥 NEW instance ${index} changed!`);
//                 });
//             });
//         }
//     });

//     observer.observe(document.body, {
//         childList: true,
//         subtree: true
//     });
// });

// waitForCodeMirror((cm) => {
//     console.log('=== SUCCESS ===');
//     console.log('CodeMirror instance:', cm);
//     console.log('Current content length:', cm.getValue().length);
//     console.log('First 100 chars:', cm.getValue().substring(0, 100));

//     // Listen for changes
//     cm.on('change', () => {
//         console.log('Code changed!');
//     });

//     // Your extension logic here
// });

// console.log('=== DIAGNOSTIC START ===');
// console.log('Document readyState:', document.readyState);
// console.log('URL:', window.location.href);

// const elements = document.querySelectorAll('.CodeMirror');
// console.log('CodeMirror elements found:', elements.length);

// elements.forEach((el, i) => {
//     console.log(`\nElement ${i}:`);
//     console.log('  - Element:', el);
//     console.log('  - typeof el.CodeMirror:', typeof el.CodeMirror);
//     console.log('  - el.CodeMirror:', el.CodeMirror);
//     console.log('  - Own properties:', Object.getOwnPropertyNames(el));
//     console.log('  - Has CodeMirror key:', Object.keys(el).includes('CodeMirror'));
// });

// console.log('\nChecking for iframes:', document.querySelectorAll('iframe').length);
// console.log('Checking for shadow roots:',
//     [...document.querySelectorAll('*')].filter(el => el.shadowRoot).length
// );
// console.log('=== DIAGNOSTIC END ===');


// function findCm() {


//     let cm = [...document.querySelectorAll('.CodeMirror')].map((el) => el.CodeMirror).find(cm => cm)


//     console.log("cm  ..... ", cm)

// }


// setInterval(() => {

//     console.log("Trying again...")
//     findCm()

// }, 2000)


// class WordHighlighter {
//     constructor() {
//         this.currentHighlights = [];
//         this.isEnabled = true;
//         this.codeMirrorInstance = null;
//         this.init();
//     }

//     init() {
//         console.log('ODS Highlighter initialized');

//         // Use multiple approaches to find CodeMirror
//         this.findCodeMirrorInstance();

//         // If not found, set up a mutation observer to catch when it becomes available
//         if (!this.codeMirrorInstance) {
//             this.setupMutationObserver();
//         }
//     }

//     findCodeMirrorInstance() {
//         console.log('Searching for CodeMirror instance...');

//         // Approach 1: Try the exact console command that works
//         try {
//             const elements = document.querySelectorAll('.CodeMirror');
//             if (elements.length > 0) {
//                 const firstElement = elements[0];
//                 console.log('Found .CodeMirror element, checking properties:', firstElement);

//                 // Log all properties to see what's available
//                 const props = Object.getOwnPropertyNames(firstElement);
//                 console.log('Element properties:', props);

//                 // Try to access CodeMirror property
//                 const cm = firstElement.CodeMirror;
//                 console.log('Direct .CodeMirror access:', cm);

//                 if (cm && typeof cm.getValue === 'function') {
//                     this.codeMirrorInstance = cm;
//                     console.log('✓ Successfully accessed CodeMirror instance via direct property');
//                     this.setupCodeMirrorEvents();
//                     return true;
//                 }
//             }
//         } catch (e) {
//             console.log('Error in direct access:', e);
//         }

//         // Approach 2: Try to execute the console command via script injection
//         try {
//             const script = document.createElement('script');
//             script.textContent = `
//           (function() {
//             const cm = document.querySelectorAll('.CodeMirror')[0].CodeMirror;
//             if (cm && typeof cm.getValue === 'function') {
//               window._foundCodeMirror = cm;
//             }
//           })();
//         `;
//             document.documentElement.appendChild(script);
//             document.documentElement.removeChild(script);

//             if (window._foundCodeMirror) {
//                 this.codeMirrorInstance = window._foundCodeMirror;
//                 console.log('✓ Found CodeMirror via script injection', this.codeMirrorInstance);
//                 window._foundCodeMirror = null;
//                 this.setupCodeMirrorEvents();
//                 return true;
//             }
//         } catch (e) {
//             console.log('Script injection failed:', e);
//         }

//         // Approach 3: Try to find the instance by looking at the global editor state
//         try {
//             // Sometimes CodeMirror stores instances in unexpected places
//             const allElements = document.querySelectorAll('*');
//             for (let element of allElements) {
//                 try {
//                     if (element.CodeMirror && typeof element.CodeMirror.getValue === 'function') {
//                         this.codeMirrorInstance = element.CodeMirror;
//                         console.log('✓ Found CodeMirror on element:', element);
//                         this.setupCodeMirrorEvents();
//                         return true;
//                     }
//                 } catch (e) {
//                     // Skip elements that throw errors
//                 }
//             }
//         } catch (e) {
//             console.log('Deep search error:', e);
//         }

//         console.log('✗ Could not find CodeMirror instance');
//         return false;
//     }

//     setupMutationObserver() {
//         console.log('Setting up mutation observer to watch for CodeMirror changes');

//         const observer = new MutationObserver((mutations) => {
//             for (let mutation of mutations) {
//                 if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
//                     if (mutation.target.classList.contains('CodeMirror')) {
//                         console.log('CodeMirror element class changed, retrying...');
//                         this.findCodeMirrorInstance();
//                         if (this.codeMirrorInstance) {
//                             observer.disconnect();
//                             break;
//                         }
//                     }
//                 }

//                 for (let node of mutation.addedNodes) {
//                     if (node.nodeType === 1 && node.classList && node.classList.contains('CodeMirror')) {
//                         console.log('New CodeMirror element added, retrying...');
//                         this.findCodeMirrorInstance();
//                         if (this.codeMirrorInstance) {
//                             observer.disconnect();
//                             break;
//                         }
//                     }
//                 }
//             }
//         });

//         observer.observe(document.body, {
//             childList: true,
//             subtree: true,
//             attributes: true,
//             attributeFilter: ['class']
//         });
//     }

//     setupCodeMirrorEvents() {
//         if (!this.codeMirrorInstance) return;

//         console.log('Setting up CodeMirror event listeners');

//         // Test the instance
//         try {
//             const content = this.codeMirrorInstance.getValue();
//             console.log('✓ CodeMirror instance verified, content length:', content.length);
//         } catch (e) {
//             console.log('✗ CodeMirror instance test failed:', e);
//             return;
//         }

//         // Set up selection tracking
//         this.codeMirrorInstance.on('cursorActivity', () => {
//             this.handleSelection();
//         });

//         this.codeMirrorInstance.on('change', () => {
//             setTimeout(() => this.handleSelection(), 50);
//         });

//         // Also track mouse events
//         const wrapper = this.codeMirrorInstance.getWrapperElement();
//         wrapper.addEventListener('mouseup', () => {
//             setTimeout(() => this.handleSelection(), 50);
//         });

//         console.log('✓ Event listeners setup complete');
//     }

//     handleSelection() {
//         if (!this.codeMirrorInstance || !this.isEnabled) return;

//         try {
//             const selection = this.codeMirrorInstance.getSelection();
//             const trimmed = selection.trim();

//             if (trimmed && trimmed.length > 1 && !trimmed.includes('\n')) {
//                 console.log('Selection detected:', trimmed);
//                 this.highlightAllOccurrences(trimmed);
//             } else {
//                 this.clearHighlights();
//             }
//         } catch (error) {
//             console.log('Selection error:', error);
//         }
//     }

//     highlightAllOccurrences(word) {
//         console.log(`Highlighting: "${word}"`);
//         this.clearHighlights();

//         try {
//             const content = this.codeMirrorInstance.getValue();
//             const regex = new RegExp(this.escapeRegExp(word), 'gi');
//             let match;
//             let count = 0;

//             while ((match = regex.exec(content)) !== null) {
//                 const start = this.codeMirrorInstance.posFromIndex(match.index);
//                 const end = this.codeMirrorInstance.posFromIndex(match.index + word.length);

//                 if (this.isValidPosition(start) && this.isValidPosition(end)) {
//                     const marker = this.codeMirrorInstance.markText(start, end, {
//                         className: `ods-highlighted-word ${count === 0 ? 'primary' : ''}`
//                     });

//                     this.currentHighlights.push(marker);
//                     count++;
//                 }
//             }

//             console.log(`✓ Added ${count} highlights`);

//         } catch (error) {
//             console.log('Highlighting error:', error);
//         }
//     }

//     isValidPosition(pos) {
//         return pos && typeof pos.line === 'number' && typeof pos.ch === 'number';
//     }

//     escapeRegExp(string) {
//         return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//     }

//     clearHighlights() {
//         this.currentHighlights.forEach(marker => {
//             try {
//                 marker.clear();
//             } catch (e) {
//                 // Ignore
//             }
//         });
//         this.currentHighlights = [];
//     }
// }

// // Initialize
// setTimeout(() => {
//     console.log('Initializing ODS Highlighter...');
//     window.odsHighlighter = new WordHighlighter();
// }, 1000);