const WebMonetization = {

    siteId: null,
    paymentPointer: null,
    monetizeByDefault: false,
    monetizationTag: null,
    monetizedSites: null,
    unmonetizedSites: null,

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
    getMonetizedSites: () => {
        if (Array.isArray(WebMonetization.monetizedSites)) {
            return WebMonetization.monetizedSites;
        }
        let monetizedSites = JSON.parse(localStorage.getItem('omeka_web_monetization_monetized_sites'));
        if (!Array.isArray(monetizedSites)) {
             monetizedSites = [];
        }
        WebMonetization.monetizedSites = monetizedSites;
        return monetizedSites;
    },

    // Get the sites where monetization has been disabled by the client.
    getUnmonetizedSites: () => {
        if (Array.isArray(WebMonetization.unmonetizedSites)) {
            return WebMonetization.unmonetizedSites;
        }
        let unmonetizedSites = JSON.parse(localStorage.getItem('omeka_web_monetization_unmonetized_sites'));
        if (!Array.isArray(unmonetizedSites)) {
             unmonetizedSites = [];
        }
        WebMonetization.unmonetizedSites = unmonetizedSites;
        return unmonetizedSites;
    },

    // Is the current site monetized?
    siteIsMonetized: () => {
        if (WebMonetization.monetizeByDefault && !WebMonetization.siteIsUnmonetized()) {
            // Here we return true because WebMonetization is configured to
            // monetize by default and the client hasn't disabled monetization.
            return true;
        }
        return WebMonetization.getMonetizedSites().includes(WebMonetization.siteId);
    },

    // Is the current site unmonetized?
    siteIsUnmonetized: () => {
        return WebMonetization.getUnmonetizedSites().includes(WebMonetization.siteId);
    },

    // Monetize this site.
    monetizeSite: () => {
        WebMonetization.addMonetizationTag();
        if (!WebMonetization.siteIsMonetized()) {
            const monetizedSites = WebMonetization.getMonetizedSites();
            monetizedSites.push(WebMonetization.siteId);
            localStorage.setItem('omeka_web_monetization_monetized_sites', JSON.stringify(monetizedSites));
        }
        if (WebMonetization.siteIsUnmonetized()) {
            const unmonetizedSites = WebMonetization.getUnmonetizedSites();
            unmonetizedSites.splice(unmonetizedSites.indexOf(WebMonetization.siteId), 1);
            localStorage.setItem('omeka_web_monetization_unmonetized_sites', JSON.stringify(unmonetizedSites));
        }
    },

    // Un-monetize this site.
    unmonetizeSite: () => {
        WebMonetization.removeMonetizationTag();
        if (WebMonetization.siteIsMonetized()) {
            const monetizedSites = WebMonetization.getMonetizedSites();
            monetizedSites.splice(monetizedSites.indexOf(WebMonetization.siteId), 1);
            localStorage.setItem('omeka_web_monetization_monetized_sites', JSON.stringify(monetizedSites));
        }
        if (!WebMonetization.siteIsUnmonetized()) {
            const unmonetizedSites = WebMonetization.getUnmonetizedSites();
            unmonetizedSites.push(WebMonetization.siteId);
            localStorage.setItem('omeka_web_monetization_unmonetized_sites', JSON.stringify(unmonetizedSites));
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
        WebMonetization.monetizeSite();
        startButton.forEach(el => el.style.display = 'none');
        stopButton.forEach(el => el.style.display = 'inline');
    }
    const stopMonetization = () => {
        WebMonetization.unmonetizeSite();
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
        if (WebMonetization.siteIsMonetized()) {
            WebMonetization.monetizeSite();
            stopButton.forEach(el => el.style.display = 'inline');
        } else {
            startButton.forEach(el => el.style.display = 'inline');
        }
    } else {
        notEnabledSpan.forEach(el => el.style.display = 'inline');
    }
});
