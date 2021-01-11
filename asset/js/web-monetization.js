const WebMonetization = {

    siteId: null,
    paymentPointer: null,
    monetizationTag: null,
    monetizedSites: null,

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

    // Get the sites that are monetized.
    getMonetizedSites: () => {
        if (Array.isArray(WebMonetization.monetizedSites)) {
            return WebMonetization.monetizedSites;
        }
        let monetizedSites = JSON.parse(localStorage.getItem('omeka_web_monetization'));
        if (!Array.isArray(monetizedSites)) {
             monetizedSites = [];
        }
        WebMonetization.monetizedSites = monetizedSites;
        return monetizedSites;
    },

    // Is the current site monetized?
    siteIsMonetized: () => {
        return WebMonetization.getMonetizedSites().includes(WebMonetization.siteId);
    },

    // Monetize this site.
    monetizeSite: () => {
        WebMonetization.addMonetizationTag();
        if (!WebMonetization.siteIsMonetized()) {
            const monetizedSites = WebMonetization.getMonetizedSites();
            monetizedSites.push(WebMonetization.siteId);
            localStorage.setItem('omeka_web_monetization', JSON.stringify(monetizedSites));
        }
    },

    // Un-monetize this site.
    unmonetizeSite: () => {
        WebMonetization.removeMonetizationTag();
        if (WebMonetization.siteIsMonetized()) {
            const monetizedSites = WebMonetization.getMonetizedSites();
            monetizedSites.splice(monetizedSites.indexOf(WebMonetization.siteId), 1);
            localStorage.setItem('omeka_web_monetization', JSON.stringify(monetizedSites));
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

    if (document.monetization && WebMonetization.siteIsMonetized()) {
        // The user monetized the site and the client has web monetization enabled.
        WebMonetization.monetizeSite();
    }
    if (document.monetization) {
        WebMonetization.initTesting();
    }

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
        // The client has web monetization enabled.
        if (WebMonetization.siteIsMonetized()) {
            stopButton.forEach(el => el.style.display = 'inline');
        } else {
            startButton.forEach(el => el.style.display = 'inline');
        }
    } else {
        // The client does not have web monetization enabled.
        notEnabledSpan.forEach(el => el.style.display = 'inline');
    }
});
