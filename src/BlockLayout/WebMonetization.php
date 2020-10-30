<?php
namespace WebMonetization\BlockLayout;

use Omeka\Api\Representation\SiteRepresentation;
use Omeka\Api\Representation\SitePageRepresentation;
use Omeka\Api\Representation\SitePageBlockRepresentation;
use Omeka\Site\BlockLayout\AbstractBlockLayout;
use Laminas\View\Renderer\PhpRenderer;

class WebMonetization extends AbstractBlockLayout
{
    public function getLabel()
    {
        return 'Web monetization'; // @translate
    }

    public function form(PhpRenderer $view, SiteRepresentation $site,
        SitePageRepresentation $page = null, SitePageBlockRepresentation $block = null
    ) {
        return $this->getLabel();
    }

    public function prepareRender(PhpRenderer $view)
    {
        $paymentPointer = $view->siteSetting('web_monetization_payment_pointer');
        if (!$paymentPointer) {
            return;
        }
        $view->headScript()->appendFile($view->assetUrl('js/web-monetization.js', 'WebMonetization'));
        $view->headScript()->appendScript(sprintf(
            'WebMonetization.siteId = %s; WebMonetization.paymentPointer = "%s";',
            $view->escapeJs($view->layout()->site->id()),
            $view->escapeJs($paymentPointer)
        ));
    }

    public function render(PhpRenderer $view, SitePageBlockRepresentation $block)
    {
        $paymentPointer = $view->siteSetting('web_monetization_payment_pointer');
        if (!$paymentPointer) {
            return;
        }
        return sprintf(
            '<div class="web-monetization">
                <button class="web-monetization-start">%s</button>
                <button class="web-monetization-stop">%s</button>
                <span class="web-monetization-disabled">%s</span>
            </div>',
            $view->translate('Start web monetization'),
            $view->translate('Stop web monetization'),
            $view->translate('Web monetization disabled')
        );
    }
}
