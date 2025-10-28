// isolated-script.js (ISOLATED world - has Chrome API access)
// console.log('Isolated script loaded');

// Load and send initial theme to MAIN world
chrome.storage.sync.get(['theme'], (data) => {
    const theme = data.theme || 'defaultTheme';
    // const enabled = data.highlightEnabled ?? true;

    // console.log(`Loading saved theme: ${theme}`);

    window.postMessage({
        type: 'APPLY_THEME',
        themeId: theme
    }, '*');

    // window.postMessage({
    //     type: 'SETTINGS_UPDATED',
    //     settings: { highlightEnabled: enabled }
    // }, '*');
});

// Listen for theme change from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // console.log('Message received:', message);

    if (message.type === 'THEME_CHANGED') {
        // Forward to MAIN world
        window.postMessage({
            type: 'APPLY_THEME',
            themeId: message.themeId
        }, '*');
    }

    if (message.type === 'SETTINGS_UPDATED') {
        window.postMessage({
            type: 'SETTINGS_UPDATED',
            settings: message.settings
        }, '*');
    }
});

// Listen for requests from MAIN world
window.addEventListener('message', (event) => {
    if (event.data.type === 'GET_CURRENT_THEME') {
        chrome.storage.sync.get(['theme'], (data) => {
            window.postMessage({
                type: 'APPLY_THEME',
                themeId: data.theme || 'defaultTheme'
            }, '*');
        });
    }
});