# Web Monetization

An [Omeka S](https://omeka.org/s/) module that enables streaming micropayments on your sites.

When cloning this repository remember to rename the directory from "WebMonetization-module" to "WebMonetization".

# Enabling Payment

To start payment, a user must get a [Coil membership](https://coil.com/) for $5 per month, install the [Coil Extension or the Puma Browser app](https://help.coil.com/docs/membership/coil-extension/), and log in to Coil. Click [here](https://coil.com/about) to learn more about Coil.

# Monetizing Your Site

To monetize your site, go to your site settings and under "Web Monetization" add your [payment pointer](https://webmonetization.org/docs/ilp-wallets/). Payment is disabled by default, but you can configure it to be enabled by default.

You can then edit any page and add a "Web monetization" block. Now, when you view the page on the public site, you'll see a control that users may use to start or stop payment. In site settings, you can also add a banner that contains the control on every page of your site. This control will only appear if the user is using a supported browser (using [Coil](https://coil.com/) or [Puma](https://www.pumabrowser.com/)).

# Configuration Options

These configuration options are available in your site settings, under "Web Monetization":

- **Payment pointer**: The public address for your wallet, provided by your wallet provider.
- **Payments turned on by default**: Check this to enable payment by default.
- **Add banner**: Check this to add a payment banner to every page of your site.
- **Monetization disabled message**: Display this text when monetization is not enabled in the browser. Clear to display nothing.
- **Site disabled message**: Display this text when payment is disabled/stopped in the browser. Clear to display nothing.
- **Site enabled message**: Display this text when payment is enabled/started in the browser. Clear to display nothing.

# Customizing the Payment Control

We designed the payment control for general purpose use. It's available via a page block as a simple toggle button that allows users to start or stop payment. If this is not sufficient, you can customize the control by either [overriding](https://omeka.org/s/docs/developer/themes/theme_modifications/#overriding-default-templates) the template, stylesheet, and script, or by modifying them directly.

You can add the control anywhere in your site by using a provided view helper. For instance, if you want it to render on every page, open your theme's layout template and add the following:

```php
<?php echo $this->webMonetization()->control(); ?>
```

You can modify the control's copy and markup by editing the template file: `WebMonetization/view/web-monetization-control.phtml`.

You can modify the control's styles by editing the stylesheet: `WebMonetization/asset/css/web-monetization-control.css`.

You can modify the control's functionality by editing the JS file: `WebMonetization/asset/js/web-monetization-control.js`. You should use the provided `WebMonetization` object to power it: `WebMonetization/asset/js/web-monetization.js`.

If you've modified these files, make sure you make backups before upgrading the module.

# How It Works and Repurposing

The JavaScript used for this module is written in a way that can be repurposed for uses outside of Omeka S. Here's a generic rundown of how this module enables monetization.

Load the `WebMonetization` JS object and the custom JS that powers the payment control. Useful functions to include in your custom JS are:

- `WebMonetization.isReady()`: Is monetization ready?
- `WebMonetization.init()`: Initialize web monetization.
- `WebMonetization.isEnabled()`: Is the current path enabled for payment?
- `WebMonetization.enablePayment()`: Enable payment.
- `WebMonetization.disablePayment()`: Disable payment.

Then, configure web monetization using these meta tags:

- `<meta name="web_monetization_payment_pointer" content="">`: The payment pointer.
- `<meta name="web_monetization_enable_by_default" content="">`: Whether to enble payment by default (false by default).
- `<meta name="web_monetization_path" content="">`: The current path. While a URL path is the conventional way to identify whether the current page is monetized, it could be any string that identifies the page in the current URL's origin.
