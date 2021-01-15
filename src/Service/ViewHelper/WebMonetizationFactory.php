<?php
namespace WebMonetization\Service\ViewHelper;

use WebMonetization\ViewHelper\WebMonetization;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;

class WebMonetizationFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $services, $requestedName, array $options = null)
    {
        return new WebMonetization($services);
    }
}
