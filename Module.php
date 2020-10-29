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
            function (Event $event) {
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
                    ],
                ]);
            }
        );
    }
}
