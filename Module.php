<?php
namespace WebMonetization;

use Omeka\Form\Element\RestoreTextarea;
use Omeka\Module\AbstractModule;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class Module extends AbstractModule
{
    const MESSAGE_MONETIZATION_DISABLED = 'You can support this site by enabling <a href="https://coil.com/">web monetization</a>.'; // @translate
    const MESSAGE_SITE_DISABLED = 'Please support this site by turning on micro-donations.'; // @translate
    const MESSAGE_SITE_ENABLED = 'Thank you for supporting this site with your micro-donations!'; // @translate

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
                'label' => 'Payment pointer', // @translate
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
                'label' => 'Payments turned on by default', // @translate
            ],
            'attributes' => [
                'value' => $form->getSiteSettings()->get('web_monetization_enable_by_default'),
            ],
        ]);
        $form->get('web_monetization')->add([
            'type' => 'checkbox',
            'name' => 'web_monetization_add_banner',
            'options' => [
                'label' => 'Add banner', // @translate
            ],
            'attributes' => [
                'value' => $form->getSiteSettings()->get('web_monetization_add_banner'),
            ],
        ]);

        $element = new RestoreTextarea('web_monetization_message_monetization_disabled');
        $element
            ->setLabel('Monetization disabled message') // @translate
            ->setAttributes([
                'rows' => '2',
            ])
            ->setRestoreButtonText('Restore default message') // @translate
            ->setValue($form->getSiteSettings()->get('web_monetization_message_monetization_disabled') ?? self::MESSAGE_MONETIZATION_DISABLED)
            ->setRestoreValue(self::MESSAGE_MONETIZATION_DISABLED);
        $form->get('web_monetization')->add($element);

        $element = new RestoreTextarea('web_monetization_message_site_disabled');
        $element
            ->setLabel('Site disabled message') // @translate
            ->setAttributes([
                'rows' => '2',
            ])
            ->setRestoreButtonText('Restore default message') // @translate
            ->setValue($form->getSiteSettings()->get('web_monetization_message_site_disabled') ?? self::MESSAGE_SITE_DISABLED)
            ->setRestoreValue(self::MESSAGE_SITE_DISABLED);
        $form->get('web_monetization')->add($element);

        $element = new RestoreTextarea('web_monetization_message_site_enabled');
        $element
            ->setLabel('Site enabled message') // @translate
            ->setAttributes([
                'rows' => '2',
            ])
            ->setRestoreButtonText('Restore default message') // @translate
            ->setValue($form->getSiteSettings()->get('web_monetization_message_site_enabled') ?? self::MESSAGE_SITE_ENABLED)
            ->setRestoreValue(self::MESSAGE_SITE_ENABLED);
        $form->get('web_monetization')->add($element);

        $form->get('web_monetization')->add($element);
    }

    public function applyWebMonetization(Event $event)
    {
        $view = $event->getTarget();
        $paymentPointer = $view->siteSetting('web_monetization_payment_pointer');
        if (!$paymentPointer) {
            return;
        }
        // Append the web monetization scripts and provide the needed variables.
        $view->headLink()->appendStylesheet($view->assetUrl('css/web-monetization-control.css', 'WebMonetization'));
        $view->headScript()->appendFile($view->assetUrl('js/web-monetization.js', 'WebMonetization'));
        $view->headScript()->appendFile($view->assetUrl('js/web-monetization-control.js', 'WebMonetization'));
        $view->headMeta()->appendName('web_monetization_path', $view->url('site', [], true));
        $view->headMeta()->appendName('web_monetization_payment_pointer', $paymentPointer);
        $view->headMeta()->appendName('web_monetization_enable_by_default', (bool) $view->siteSetting('web_monetization_enable_by_default'));

        // Add the banner if configured to do so.
        if ($view->siteSetting('web_monetization_add_banner')) {
            $view->htmlElement('body')->appendAttribute(
                'data-web-monetization-banner',
                $view->webMonetization()->control()
            );
        }
    }
}
