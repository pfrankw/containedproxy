let targetCookieStoreId;
let proxyConfig;

// Load settings from storage
browser.storage.local.get(['settings']).then(data => {
    if (data.settings) initializeProxy(data.settings);
});

// Listen for settings changes
browser.storage.onChanged.addListener(changes => {
    if (changes.settings) initializeProxy(changes.settings.newValue);
});

async function initializeProxy(settings) {
    try {
        // Clear previous proxy if exists
        if (browser.proxy.onRequest.hasListener(handleProxyRequest)) {
            browser.proxy.onRequest.removeListener(handleProxyRequest);
        }
        
        if (settings.containerName.length > 0) {

            // Get container ID
            const containers = await browser.contextualIdentities.query({
                name: settings.containerName
            });

            if (containers.length === 0) {
                console.error('Container not found:', settings.containerName);
                return;
            }

            targetCookieStoreId = containers[0].cookieStoreId;
        } else {
            targetCookieStoreId = 'firefox-default';
        }

        proxyConfig = {
            type: settings.proxyType,
            host: settings.proxyHost,
            port: settings.proxyPort,
            proxyDNS: true
        };

        // Register new proxy handler
        browser.proxy.onRequest.addListener(handleProxyRequest, { urls: ["<all_urls>"] });
        console.log('Proxy updated for container:', settings.containerName);
    } catch (error) {
        console.error('Proxy initialization error:', error);
    }
}

function handleProxyRequest(requestInfo) {
    if (requestInfo.cookieStoreId == targetCookieStoreId)
        return proxyConfig;
   
    return { type: "direct" };
}
