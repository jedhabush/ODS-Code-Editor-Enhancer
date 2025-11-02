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
// const isDataPortal = hostname.startsWith('data.') || hostname.startsWith('smart.');
// const isOpenDataSoft = hostname.includes('.opendatasoft.com');
const isOpenDataSoft = path.includes('/backoffice/pages/code-editor/');



// Listen for theme changes from isolated script
window.addEventListener('message', (event) => {

    if (!isOpenDataSoft) {
        console.log("RETURNED EARLY ")
        return; // Exit early
    }

    if (event.data.type === 'APPLY_THEME') {
        if (window.ExtensionThemes) {
            window.ExtensionThemes.applyTheme(event.data.themeId);
            console.log('✅ Theme applied:', event.data.themeId);
            // window.location.reload();
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

    if (!isOpenDataSoft) {
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




// features need to be here 
function attachToCodeMirror(cm, label = 'CodeMirror') {

    // If not permitted domain return
    if (!isOpenDataSoft) {
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


    // Setup search feature
    if (window.SearchFeature && window.SearchFeature.setup) {
        window.SearchFeature.setup(cm);
        // console.log('✨ Comment toggle (Ctrl/Cmd + /) enabled');
    } else {
        console.warn('⚠️ SearchFeature not loaded');
    }


    // Setup Autocomplete feature
    if (window.AutocompleteFeature && window.AutocompleteFeature.setup) {
        window.AutocompleteFeature.setup(cm);
        // console.log('✨ Comment toggle (Ctrl/Cmd + /) enabled');
    } else {
        console.warn('⚠️ Autocomplete not loaded');
    }



}

// Start
window.CodeMirrorFinder.waitFor(() => {
    window.CodeMirrorFinder.monitor(attachToCodeMirror)
})


