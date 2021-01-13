document.addEventListener('DOMContentLoaded', function() {
    WebMonetization.init();
});

const WebMonetization = {

    // The current site ID
    siteId: null,
    // The configured payment pointer
    paymentPointer: null,
    // Whether to enble payment by default
    enableByDefault: false,
    // The monetization meta tag
    monetizationTag: null,
    // An array of site IDs where payment has been enabled
    enabledSites: null,
    // An array of site IDs where payment has been disabled
    disabledSites: null,

    // Initialize web monetization.
    init: () => {
        if (document.monetization) {
            // WebMonetization.initTesting(); // uncomment to init testing
        }
        if (document.monetization && WebMonetization.siteIsEnabled()) {
            WebMonetization.enablePayment();
        }
    },

    // Add the web monetization meta tag to the head.
    addMonetizationTag: () => {
        if (!WebMonetization.monetizationTag) {
            // Create the tag if not already created.
            monetizationTag = document.createElement('meta');
            monetizationTag.setAttribute('name', 'monetization');
            monetizationTag.setAttribute('content', WebMonetization.paymentPointer);
        }
        document.head.appendChild(monetizationTag);
        WebMonetization.monetizationTag = monetizationTag;
    },

    // Remove the web monetization meta tag from the head.
    removeMonetizationTag: () => {
        WebMonetization.monetizationTag.remove();
    },

    // Get the sites where payment has been enabled by the client.
    getEnabledSites: () => {
        if (Array.isArray(WebMonetization.enabledSites)) {
            return WebMonetization.enabledSites;
        }
        let enabledSites = JSON.parse(localStorage.getItem('omeka_web_monetization_enabled_sites'));
        if (!Array.isArray(enabledSites)) {
             enabledSites = [];
        }
        WebMonetization.enabledSites = enabledSites;
        return enabledSites;
    },

    // Get the sites where payment has been disabled by the client.
    getDisabledSites: () => {
        if (Array.isArray(WebMonetization.disabledSites)) {
            return WebMonetization.disabledSites;
        }
        let disabledSites = JSON.parse(localStorage.getItem('omeka_web_monetization_disabled_sites'));
        if (!Array.isArray(disabledSites)) {
             disabledSites = [];
        }
        WebMonetization.disabledSites = disabledSites;
        return disabledSites;
    },

    // Is the current site enabled for payment?
    siteIsEnabled: () => {
        if (WebMonetization.enableByDefault && !WebMonetization.siteIsDisabled()) {
            // Here we return true because payment is enabled by default and the
            // client hasn't already disabled payment.
            return true;
        }
        return WebMonetization.getEnabledSites().includes(WebMonetization.siteId);
    },

    // Is the current site disabled for payment?
    siteIsDisabled: () => {
        return WebMonetization.getDisabledSites().includes(WebMonetization.siteId);
    },

    // Enable payment on this site.
    enablePayment: () => {
        WebMonetization.addMonetizationTag();
        if (!WebMonetization.siteIsEnabled()) {
            const enabledSites = WebMonetization.getEnabledSites();
            enabledSites.push(WebMonetization.siteId);
            localStorage.setItem('omeka_web_monetization_enabled_sites', JSON.stringify(enabledSites));
        }
        if (WebMonetization.siteIsDisabled()) {
            const disabledSites = WebMonetization.getDisabledSites();
            disabledSites.splice(disabledSites.indexOf(WebMonetization.siteId), 1);
            localStorage.setItem('omeka_web_monetization_disabled_sites', JSON.stringify(disabledSites));
        }
    },

    // Disable payment on this site.
    disablePayment: () => {
        WebMonetization.removeMonetizationTag();
        if (WebMonetization.siteIsEnabled()) {
            const enabledSites = WebMonetization.getEnabledSites();
            enabledSites.splice(enabledSites.indexOf(WebMonetization.siteId), 1);
            localStorage.setItem('omeka_web_monetization_enabled_sites', JSON.stringify(enabledSites));
        }
        if (!WebMonetization.siteIsDisabled()) {
            const disabledSites = WebMonetization.getDisabledSites();
            disabledSites.push(WebMonetization.siteId);
            localStorage.setItem('omeka_web_monetization_disabled_sites', JSON.stringify(disabledSites));
        }
    },

    // Initialize testing. Use this function for testing purposes only.
    initTesting: () => {
        document.monetization.addEventListener('monetizationstop', e => {
            console.log(document.monetization.state, e);
        });
        document.monetization.addEventListener('monetizationpending', e => {
            console.log(document.monetization.state, e);
        });
        document.monetization.addEventListener('monetizationstart', e => {
            console.log(document.monetization.state, e);
        });
        let scale;
        let total = 0;
        document.monetization.addEventListener('monetizationprogress', e => {
            console.log(document.monetization.state, e);
            if (total === 0) {
                scale = e.detail.assetScale;
                console.log(e.detail.assetCode);
            }
            total += Number(e.detail.amount);
            const formatted = (total * Math.pow(10, -scale)).toFixed(scale);
            console.log(formatted);
        });
    }
};
