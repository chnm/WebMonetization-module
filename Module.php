<?php
namespace WebMonetization;

use Omeka\Module\AbstractModule;
use Laminas\EventManager\Event;
use Laminas\EventManager\SharedEventManagerInterface;

class Module extends AbstractModule
{
    public function getConfig()
    {
        return include sprintf('%s/config/module.config.php', __DIR__);
    }

    public function attachListeners(SharedEventManagerInterface $sharedEventManager)
    {
        $services = $this->getServiceLocator();

        $sharedEventManager->attach(
            'Omeka\Form\SiteSettingsForm',
            'form.add_elements',
            [$this, 'addSiteSettings']
        );

        // Apply web monetization to all public site controllers.
        $config = $services->get('Config');
        $controllers = array_merge(
            array_keys($config['controllers']['invokables']),
            array_keys($config['controllers']['factories'])
        );
        foreach ($controllers as $controller) {
            if (false !== strpos($controller, '\Controller\Site\\')) {
                $sharedEventManager->attach(
                    $controller,
                    'view.layout',
                    [$this, 'applyWebMonetization']
                );
            }
        }
    }

    public function addSiteSettings(Event $event)
    {
        $form = $event->getTarget();
        $form->add([
            'type' => 'fieldset',
            'name' => 'web_monetization',
            'options' => [
                'label' => 'Web Monetization', // @translate
            ],
        ]);
        $form->get('web_monetization')->add([
            'type' => 'text',
            'name' => 'web_monetization_payment_pointer',
            'options' => [
                'label' => 'Payment pointer'
            ],
            'attributes' => [
                'value' => $form->getSiteSettings()->get('web_monetization_payment_pointer'),
                'pattern' => '^\$.+',
            ],
        ]);
        $form->get('web_monetization')->add([
            'type' => 'checkbox',
            'name' => 'web_monetization_enable_by_default',
            'options' => [
                'label' => 'Enable by default'
            ],
            'attributes' => [
                'value' => $form->getSiteSettings()->get('web_monetization_enable_by_default'),
            ],
        ]);
    }

    public function applyWebMonetization(Event $event)
    {
        $view = $event->getTarget();
        $paymentPointer = $view->siteSetting('web_monetization_payment_pointer');
        if (!$paymentPointer) {
            return;
        }
        // Append the web monetization scripts and provide the needed variables.
        $view->headScript()->appendFile($view->assetUrl('js/web-monetization.js', 'WebMonetization'));
        $view->headScript()->appendFile($view->assetUrl('js/web-monetization-control.js', 'WebMonetization'));
        $view->headScript()->appendScript(sprintf('
            WebMonetization.siteId = %s;
            WebMonetization.paymentPointer = "%s";
            WebMonetization.enableByDefault = %s;',
            $view->escapeJs($view->layout()->site->id()),
            $view->escapeJs($paymentPointer),
            $view->escapeJs($view->siteSetting('web_monetization_enable_by_default') ? 'true' : 'false')
        ));
        $view->headLink()->appendStylesheet($view->assetUrl('css/web-monetization-control.css', 'WebMonetization'));
    }
}
