(function () {
    "use strict";

    chrome.app.runtime.onLaunched.addListener(function () {
        chrome.app.window.create('index.html', {
            innerBounds: {
                width: 1024,
                height: 768,
                minWidth: 800,
                minHeight: 600
            },
            id: 'main_window'
        });
    });
} ());