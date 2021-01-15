<?php
namespace WebMonetization\BlockLayout;

use Omeka\Api\Representation\SiteRepresentation;
use Omeka\Api\Representation\SitePageRepresentation;
use Omeka\Api\Representation\SitePageBlockRepresentation;
use Omeka\Site\BlockLayout\AbstractBlockLayout;
use Zend\View\Renderer\PhpRenderer;

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

    public function render(PhpRenderer $view, SitePageBlockRepresentation $block)
    {
        return $view->webMonetization()->control();
    }
}
