const WebMonetization = {

    // The current path. While a URL path is the conventional way to identify
    // whether the current page is monetized, it could be any string that
    // identifies the page in the current URL's origin.
    path: null,

    // The payment pointer.
    paymentPointer: null,

    // Whether to enble payment by default.
    enableByDefault: false,

    // The monetization meta tag.
    monetizationTag: null,

    // An array of unique IDs where payment has been enabled.
    enabled: null,

    // An array of unique IDs where payment has been disabled.
    disabled: null,

    // Initialize web monetization.
    init: () => {
        // Configure using web_monetization_* meta tags.
        const metaPath = document.querySelector('meta[name="web_monetization_path"]');
        const metaPaymentPointer = document.querySelector('meta[name="web_monetization_payment_pointer"]');
        const metaEnableByDefault = document.querySelector('meta[name="web_monetization_enable_by_default"]');
        if (metaPath) {
            WebMonetization.path = metaPath.content;
        }
        if (metaPaymentPointer) {
            WebMonetization.paymentPointer = metaPaymentPointer.content;
        }
        if (metaEnableByDefault) {
            WebMonetization.enableByDefault = metaEnableByDefault.content;
        }
        // Enable payment if monetization is ready and payment was already enabled.
        if (document.monetization && WebMonetization.isEnabled()) {
            WebMonetization.enablePayment();
        }
    },

    // Is monetization ready?
    isReady: () => {
        return document.monetization ? true : false;
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

    // Get the paths where payment has been enabled by the client.
    getEnabled: () => {
        if (Array.isArray(WebMonetization.enabled)) {
            return WebMonetization.enabled;
        }
        let enabled = JSON.parse(localStorage.getItem('web_monetization_enabled'));
        if (!Array.isArray(enabled)) {
             enabled = [];
        }
        WebMonetization.enabled = enabled;
        return enabled;
    },

    // Get the paths where payment has been disabled by the client.
    getDisabled: () => {
        if (Array.isArray(WebMonetization.disabled)) {
            return WebMonetization.disabled;
        }
        let disabled = JSON.parse(localStorage.getItem('web_monetization_disabled'));
        if (!Array.isArray(disabled)) {
             disabled = [];
        }
        WebMonetization.disabled = disabled;
        return disabled;
    },

    // Is the current path enabled for payment?
    isEnabled: () => {
        if (WebMonetization.enableByDefault && !WebMonetization.isDisabled()) {
            // Here we return true because payment is enabled by default and the
            // client hasn't already disabled payment.
            return true;
        }
        return WebMonetization.getEnabled().includes(WebMonetization.path);
    },

    // Is the current path disabled for payment?
    isDisabled: () => {
        return WebMonetization.getDisabled().includes(WebMonetization.path);
    },

    // Enable payment.
    enablePayment: () => {
        WebMonetization.addMonetizationTag();
        if (!WebMonetization.isEnabled()) {
            const enabled = WebMonetization.getEnabled();
            enabled.push(WebMonetization.path);
            localStorage.setItem('web_monetization_enabled', JSON.stringify(enabled));
        }
        if (WebMonetization.isDisabled()) {
            const disabled = WebMonetization.getDisabled();
            disabled.splice(disabled.indexOf(WebMonetization.path), 1);
            localStorage.setItem('web_monetization_disabled', JSON.stringify(disabled));
        }
    },

    // Disable payment.
    disablePayment: () => {
        WebMonetization.removeMonetizationTag();
        if (WebMonetization.isEnabled()) {
            const enabled = WebMonetization.getEnabled();
            enabled.splice(enabled.indexOf(WebMonetization.path), 1);
            localStorage.setItem('web_monetization_enabled', JSON.stringify(enabled));
        }
        if (!WebMonetization.isDisabled()) {
            const disabled = WebMonetization.getDisabled();
            disabled.push(WebMonetization.path);
            localStorage.setItem('web_monetization_disabled', JSON.stringify(disabled));
        }
    },

    // Enable testing.
    enableTesting: () => {
        if (document.monetization) {
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
    }
};
