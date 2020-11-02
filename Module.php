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
        $sharedEventManager->attach(
            'Omeka\Form\SiteSettingsForm',
            'form.add_elements',
            [$this, 'addSiteSettings']
        );
        // All public controllers.
        $controllers = [
            'Omeka\Controller\Site\Index',
            'Omeka\Controller\Site\Item',
            'Omeka\Controller\Site\ItemSet',
            'Omeka\Controller\Site\Media',
            'Omeka\Controller\Site\Page',
            'Omeka\Controller\Site\CrossSiteSearch',
        ];
        foreach ($controllers as $controller) {
            $sharedEventManager->attach(
                $controller,
                'view.layout',
                [$this, 'addToLayout']
            );
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
    }

    public function addToLayout(Event $event)
    {
        $view = $event->getTarget();
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
}
