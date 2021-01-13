# Web Monetization

An [Omeka S](https://omeka.org/s/) module that enables micro-donations on your sites.

When cloning this repository remember to rename the directory from "WebMonetization-module" to "WebMonetization".

# Documentation

To monetize your site, go to your site settings and under "Web Monetization" add your [payment pointer](https://webmonetization.org/docs/ilp-wallets/). Payment is disabled by default, but you can configure it to be enabled by default.

You should then edit a page and add a "Web monetization" block. Now, when you view this page on the public site, you'll see a control that users may use to start or stop payment. This control will only appear if the user is using a supported browser (using [Coil](https://coil.com/) or [Puma](https://www.pumabrowser.com/)).
