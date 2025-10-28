(function () {
    'use strict';


    function findCodeMirror() {

        const elements = document.querySelectorAll('.CodeMirror');
        if (elements.length === 0) return null;

        const cm = [...elements].map(el => el.CodeMirror).find(cm => cm);
        return cm;
    }

    // Track all CodeMirror instances we've seen
    const trackedInstances = new WeakSet();

    function monitorCodeMirror(onAttachToCodeMirrorCallback) {
        // Check for existing instances
        const allCMs = [...document.querySelectorAll('.CodeMirror')]
            .map(el => el.CodeMirror)
            .filter(cm => cm);

        allCMs.forEach((cm, index) => {
            onAttachToCodeMirrorCallback(cm, `Instance ${index}`);
        });

        // console.log(`Found ${allCMs.length} initial CodeMirror instance(s)`);

        // Monitor for new instances, detects when DOM changes
        const observer = new MutationObserver(() => {
            // This runs EVERY TIME the DOM changes
            const currentCMs = [...document.querySelectorAll('.CodeMirror')]
                .map(el => el.CodeMirror)
                .filter(cm => cm);

            currentCMs.forEach((cm, index) => {
                onAttachToCodeMirrorCallback(cm, `Instance ${index}`);
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });



        // console.log('🔍 Monitoring for CodeMirror instances...');
    }

    function waitForCodeMirror(monitorCodeMirrorCallback, timeout = 30000) {
        const startTime = Date.now();

        const check = () => {
            const cm = findCodeMirror();

            if (cm) {
                // console.log('✓ Initial CodeMirror found');
                monitorCodeMirrorCallback();
                return;
            }

            if (Date.now() - startTime > timeout) {
                console.error('✗ CodeMirror not found');
                return;
            }

            setTimeout(check, 200);
        };

        setTimeout(check, 500);
    }


    // Expose to global namespace
    window.CodeMirrorFinder = {
        find: findCodeMirror,
        monitor: monitorCodeMirror,
        waitFor: waitForCodeMirror,
        trackedInstances: trackedInstances
    };

    // console.log('📦 CodeMirror Finder module loaded');

})()