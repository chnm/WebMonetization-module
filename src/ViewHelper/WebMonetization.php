<?php
namespace WebMonetization\ViewHelper;

use Laminas\ServiceManager\ServiceLocatorInterface;
use Laminas\View\Helper\AbstractHelper;

class WebMonetization extends AbstractHelper
{
    protected $services;

    public function __construct(ServiceLocatorInterface $services)
    {
        $this->services = $services;
    }

    public function startStopControl()
    {
        $view = $this->getView();
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
