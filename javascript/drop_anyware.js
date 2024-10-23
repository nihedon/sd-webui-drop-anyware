'use strict';

(function() {
    async function onPageLoaded() {
        let tab = null;
        while (!tab) {
            tab = gradioApp().getElementById("tab_pnginfo");
            if (!tab) {
                await new Promise((resolve) => setTimeout(resolve, 200));
            }
        }
        return tab;
    }

    document.addEventListener('DOMContentLoaded', function() {
        onPageLoaded().then(() => {
            const pnginfoUploadContainer = gradioApp().querySelector("#tab_pnginfo .upload-container");
            const pnginfoTabSelector = "#tab_pnginfo-button";

            document.documentElement.addEventListener('drop', (e) => {
                const target = e.target;
                if (target.classList.contains('upload-container')) {
                    return;
                }
                if (target.closest("div[id$=_prompt]") != null) {
                    return;
                }
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type.startsWith('image/')) {
                    e.preventDefault();
                    simulateDropOn(e, pnginfoUploadContainer, pnginfoTabSelector);
                }
            });

            document.documentElement.addEventListener('dragover', (e) => {
                const target = e.target;
                if (target.classList.contains('upload-container')) {
                    return;
                }
                if (target.closest("div[id$=_prompt]") != null) {
                    return;
                }
                if (e.dataTransfer != null && e.dataTransfer.types.includes("Files")) {
                    e.preventDefault();
                }
            });

            function simulateDropOn(e, container, tabSelector) {
                const files = e.dataTransfer.files;
                const dataTransfer = new DataTransfer();
                for (let i = 0; i < files.length; i++) {
                    dataTransfer.items.add(files[i]);
                }
                container.dispatchEvent(new DragEvent('drop', {
                    bubbles: true,
                    cancelable: true,
                    dataTransfer: dataTransfer
                }));
                const tab = gradioApp().querySelector(tabSelector);
                if (tab != null) {
                    tab.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                }
            }
        });
    });
})();
