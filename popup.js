// popup.js
/* The line `console.log('Popup script starting...');` is simply logging a message to the console
indicating that the popup script is starting. This can be helpful for debugging purposes to track
the flow of the script execution. */
// console.log('Popup script starting...');

// Initialize popup after ensuring themes.js is loaded
function initPopup() {
    // console.log('initPopup called, checking for ExtensionThemes...');

    // Check if ExtensionThemes is available
    if (typeof window.ExtensionThemes === 'undefined') {
        // console.log('⏳ Waiting for ExtensionThemes...');
        setTimeout(initPopup, 50);
        return;
    }

    // console.log('✅ ExtensionThemes available, initializing popup...');

    const themeSelect = document.getElementById('themeSelect');
    // const highlightCheckbox = document.getElementById('highlightEnabled');
    const saveButton = document.getElementById('save');
    const shortcutsToggle = document.getElementById('shortcutsToggle');
    const shortcutsPanel = document.getElementById('shortcutsPanel');

    if (!themeSelect || !saveButton) {
        console.error('❌ Could not find required elements');
        return;
    }

    const themeList = window.ExtensionThemes.getThemeList();
    // console.log('📋 Available themes:', themeList);

    // Clear loading message
    themeSelect.innerHTML = '';

    // Populate dropdown
    themeList.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.id;
        option.textContent = theme.name;
        themeSelect.appendChild(option);
    });

    // console.log('✅ Theme dropdown populated with', themeList.length, 'themes');

    // Load saved settings
    chrome.storage.sync.get(['theme'], (data) => {
        // console.log('📦 Loaded from storage:', data);

        const savedTheme = data.theme || 'defaultTheme';
        // const highlightEnabled = data.highlightEnabled ?? true;

        themeSelect.value = savedTheme;
        // highlightCheckbox.checked = highlightEnabled;

        updateThemePreview(savedTheme);

        // console.log('✅ Settings loaded:', { savedTheme, highlightEnabled });
    });

    // Update preview on change
    themeSelect.addEventListener('change', (e) => {
        // console.log('🎨 Theme selection changed to:', e.target.value);
        updateThemePreview(e.target.value);
    });

    // Save button
    saveButton.addEventListener('click', () => {
        // console.log('💾 Save button clicked');
        saveSettings();
    });

    // Keyboard shortcuts toggle
    if (shortcutsToggle && shortcutsPanel) {
        shortcutsToggle.addEventListener('click', () => {
            // console.log('⌨️ Keyboard shortcuts toggle clicked');
            toggleShortcuts();
        });
    }

    // console.log('✅ Popup fully initialized');
}

function updateThemePreview(themeId) {
    if (!window.ExtensionThemes) {
        console.error('❌ Cannot update preview: ExtensionThemes not loaded');
        return;
    }

    const theme = window.ExtensionThemes.getTheme(themeId);
    const preview = document.getElementById('themePreview');
    const previewTags = document.querySelector('#divTags .divTag')
    const previewTagsClse = document.querySelector('#divTags .divTagCls')
    const previewAtt = document.querySelector('#divTags .divTag .class-dec')
    const previewRegTxt = document.querySelector('#divTags .regText')

    if (!preview) {
        console.error('❌ Preview element not found');
        return;
    }

    if (theme.name == 'Default Theme') {
        preview.style.backgroundColor = "#ffff"
        preview.style.color = "#a11";
        previewTags.style.color = "#170"
        previewTagsClse.style.color = "#170"
        previewAtt.style.color = "#00c";
        previewRegTxt.style.color = "#000";
        return;
    }


    // Extract background and color from theme styles
    const bgMatch = theme.styles.match(/\.CodeMirror\s*{[^}]*background(?:-color)?:\s*([^;!]+)/);
    const colorMatch = theme.styles.match(/span\.cm-string\s*{[^}]*color:\s*([^;!]+)/);
    const divTags = theme.styles.match(/span\.cm-tag\s*{[^}]*color:\s*([^;!]+)/);
    const attrText = theme.styles.match(/span\.cm-attribute\s*{[^}]*color:\s*([^;!]+)/);
    const regText = theme.styles.match(/\.CodeMirror\s*{[^}]*color:\s*([^;!]+)/);

    if (bgMatch) {
        preview.style.backgroundColor = bgMatch[1].trim();
    }
    if (colorMatch) {
        preview.style.color = colorMatch[1].trim();
    }
    if (divTags) {
        previewTags.style.color = divTags[1].trim();
        previewTagsClse.style.color = divTags[1].trim();
    }
    if (attrText) {
        previewAtt.style.color = attrText[1].trim();
    }
    if (regText) {
        previewRegTxt.style.color = regText[1].trim();
    }


    // console.log(`🎨 Preview updated to: ${theme.name}`);
}

function saveSettings() {
    const path = window.location.pathname;
    const isOpenDataSoft = path.includes('/backoffice/pages/code-editor/');
    const themeSelect = document.getElementById('themeSelect');
    // const highlightCheckbox = document.getElementById('highlightEnabled');

    const settings = {
        theme: themeSelect.value,
        // highlightEnabled: highlightCheckbox.checked
    };

    // console.log('💾 Saving settings:', settings);

    chrome.storage.sync.set(settings, () => {
        if (chrome.runtime.lastError) {
            console.error('❌ Error saving settings:', chrome.runtime.lastError);
            return;
        }

        // console.log('✅ Settings saved to storage');

        // Notify all tabs about the changes
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // console.log('📢 Found', tabs.length, 'active tabs');

            tabs.forEach(tab => {
                // Check if tab URL matches our content script patterns
                if (tab.url && isOpenDataSoft) {
                    // console.log('📤 Sending messages to tab:', tab.id);

                    // Send theme change
                    chrome.tabs.sendMessage(tab.id, {
                        type: 'THEME_CHANGED',
                        themeId: settings.theme
                    }).then(() => {
                        // console.log('✅ Theme message sent');
                    }).catch(err => {
                        console.log('⚠️ Could not send theme message:', err.message);
                    });

                    // Send settings update
                    chrome.tabs.sendMessage(tab.id, {
                        type: 'SETTINGS_UPDATED',
                        settings: settings
                    }).then(() => {
                        // console.log('✅ Settings message sent');
                    }).catch(err => {
                        console.log('⚠️ Could not send settings message:', err.message);
                    });
                } else {
                    console.log('⏭️ Skipping tab (URL doesn\'t match):', tab.url);
                }
            });
        });

        // Visual feedback
        const btn = document.getElementById('save');
        const originalText = btn.textContent;
        btn.textContent = '✓ Saved!';
        btn.classList.add('success');

        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('success');
        }, 1500);
    });
}

// Keyboard shortcuts toggle functionality
function toggleShortcuts() {
    const shortcutsPanel = document.getElementById('shortcutsPanel');
    const toggleArrow = document.querySelector('.toggle-arrow');

    if (!shortcutsPanel || !toggleArrow) {
        console.error('❌ Shortcuts elements not found');
        return;
    }

    const isOpen = shortcutsPanel.classList.contains('open');

    if (isOpen) {
        // Close panel
        shortcutsPanel.classList.remove('open');
        toggleArrow.classList.remove('rotated');
        // console.log('📖 Shortcuts panel closed');
    } else {
        // Open panel
        shortcutsPanel.classList.add('open');
        toggleArrow.classList.add('rotated');
        // console.log('📖 Shortcuts panel opened');
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopup);
} else {
    initPopup();
}

// console.log('✅ Popup script loaded');