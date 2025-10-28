// themes/theme-manager.js
// import { getTheme } from './themes.js';

let currentStyleElement = null;

export function applyTheme(themeId) {
    // Remove old theme
    if (currentStyleElement) {
        currentStyleElement.remove();
    }

    // Get theme
    const theme = getTheme(themeId);

    // Create and inject new style element
    const style = document.createElement('style');
    style.id = 'cm-extension-theme';
    style.textContent = theme.styles;
    document.head.appendChild(style);

    currentStyleElement = style;

    // console.log(`✅ Applied theme: ${theme.name}`);
}

export function removeTheme() {
    if (currentStyleElement) {
        currentStyleElement.remove();
        currentStyleElement = null;
    }
}