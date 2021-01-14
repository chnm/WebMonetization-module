# Web Monetization

An [Omeka S](https://omeka.org/s/) module that enables streaming micropayments on your sites.

When cloning this repository remember to rename the directory from "WebMonetization-module" to "WebMonetization".

# Enabling Payment

To start payment, a user must get a [Coil membership](https://coil.com/) for $5 per month, install the [Coil Extension or the Puma Browser app](https://help.coil.com/docs/membership/coil-extension/), and log in to Coil. Click [here](https://coil.com/about) to learn more about Coil.

# Monetizing Your Site

To monetize your site, go to your site settings and under "Web Monetization" add your [payment pointer](https://webmonetization.org/docs/ilp-wallets/). Payment is disabled by default, but you can configure it to be enabled by default.

You can then edit any page and add a "Web monetization" block. Now, when you view the page on the public site, you'll see a control that users may use to start or stop payment. This control will only appear if the user is using a supported browser (using [Coil](https://coil.com/) or [Puma](https://www.pumabrowser.com/)).

# Customizing the Payment Control

We designed the payment control for general purpose use. It's available via a page block as a simple toggle button that allows users to start or stop payment. If this is not sufficient, you can customize the control by modifying the copy, markup, stylesheet, and JavaScript yourself.

You can add the control anywhere in your site by using a provided view helper. For instance, if you want it to render on every page, open your theme's layout template and add the following:

```php
<?php echo $this->webMonetization()->control(); ?>
```

You can modify the control's copy and markup by editing the template file: `WebMonetization/view/web-monetization-control.phtml`.

You can modify the control's styles by editing the stylesheet: `WebMonetization/asset/css/web-monetization-control.css`.

You can modify the control's functionality by editing the JS file: `WebMonetization/asset/js/web-monetization-control.js`. You should use the provided `WebMonetization` object to power it: `WebMonetization/asset/js/web-monetization.js`.

If you've modified these files, make sure you make backups before upgrading the module.
