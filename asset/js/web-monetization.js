const WebMonetization = {

    siteId: null,
    paymentPointer: null,
    enableByDefault: false,
    monetizationTag: null,
    enabledSites: null,
    disabledSites: null,

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

    // Get the sites where monetization has been enabled by the client.
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

    // Get the sites where monetization has been disabled by the client.
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

    // Is the current site enabled?
    siteIsEnabled: () => {
        if (WebMonetization.enableByDefault && !WebMonetization.siteIsDisabled()) {
            // Here we return true because monetization is enabled by default
            // and the client hasn't already disabled monetization.
            return true;
        }
        return WebMonetization.getEnabledSites().includes(WebMonetization.siteId);
    },

    // Is the current site disabled?
    siteIsDisabled: () => {
        return WebMonetization.getDisabledSites().includes(WebMonetization.siteId);
    },

    // Enable this site.
    enableSite: () => {
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

    // Disable this site.
    disableSite: () => {
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

document.addEventListener('DOMContentLoaded', function() {

    const startButton = document.querySelectorAll('.web-monetization-start');
    const stopButton = document.querySelectorAll('.web-monetization-stop');
    const notEnabledSpan = document.querySelectorAll('.web-monetization-disabled');

    startButton.forEach(el => el.style.display = 'none');
    stopButton.forEach(el => el.style.display = 'none');
    notEnabledSpan.forEach(el => el.style.display = 'none');

    const startMonetization = () => {
        WebMonetization.enableSite();
        startButton.forEach(el => el.style.display = 'none');
        stopButton.forEach(el => el.style.display = 'inline');
    }
    const stopMonetization = () => {
        WebMonetization.disableSite();
        startButton.forEach(el => el.style.display = 'inline');
        stopButton.forEach(el => el.style.display = 'none');
    };

    document.addEventListener('click', e => {
        if (e.target.classList.contains('web-monetization-start')) {
            startMonetization();
        }
    });
    document.addEventListener('click', e => {
        if (e.target.classList.contains('web-monetization-stop')) {
            stopMonetization();
        }
    });

    if (document.monetization) {
        // The site is monetized.
        WebMonetization.initTesting();
        if (WebMonetization.siteIsEnabled()) {
            WebMonetization.enableSite();
            stopButton.forEach(el => el.style.display = 'inline');
        } else {
            startButton.forEach(el => el.style.display = 'inline');
        }
    } else {
        // The site is not monetized.
        notEnabledSpan.forEach(el => el.style.display = 'inline');
    }
});
