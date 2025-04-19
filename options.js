document.addEventListener('DOMContentLoaded', () => {

    // Load containers into <select>
    browser.contextualIdentities.query({}).then(containers => {
        containers.forEach(container => {
            const option = document.createElement('option');
            option.value = container.name;
            option.textContent = container.name;
            document.getElementById('containerName').appendChild(option);
        });
    });

    // Load saved settings
    browser.storage.local.get(['settings']).then(data => {
        const settings = data.settings || {};
        document.getElementById('containerName').value = settings.containerName || '';
        document.getElementById('proxyType').value = settings.proxyType || 'socks';
        document.getElementById('proxyHost').value = settings.proxyHost || '';
        document.getElementById('proxyPort').value = settings.proxyPort || '';
    });

    // Save button handler
    document.getElementById('save').addEventListener('click', () => {
        const settings = {
            containerName: document.getElementById('containerName').value.trim(),
            proxyType: document.getElementById('proxyType').value,
            proxyHost: document.getElementById('proxyHost').value.trim(),
            proxyPort: parseInt(document.getElementById('proxyPort').value)
        };

        // Basic validation
        if (!settings.proxyHost || !settings.proxyPort) {
            showStatus('Please set Proxy Host and Proxy Port!', 'red');
            return;
        }

        // Save valid settings
        browser.storage.local.set({ settings })
            .then(() => showStatus('Settings saved!', 'green'))
            .catch(err => showStatus('Save failed: ' + err, 'red'));
    });

    function showStatus(text, color) {
        const status = document.getElementById('status');
        status.textContent = text;
        status.style.color = color;
        setTimeout(() => status.textContent = '', 3000);
    }
});
