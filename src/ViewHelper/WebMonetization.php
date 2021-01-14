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

    public function control()
    {
        $view = $this->getView();
        $paymentPointer = $view->siteSetting('web_monetization_payment_pointer');
        if (!$paymentPointer) {
            return;
        }
        return $view->partial('common/web-monetization-control');
    }
}
