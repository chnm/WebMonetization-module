<?php
namespace WebMonetization;

return [
    'translator' => [
        'translation_file_patterns' => [
            [
                'type' => 'gettext',
                'base_dir' => OMEKA_PATH . '/modules/Datascribe/language',
                'pattern' => '%s.mo',
            ],
        ],
    ],
    'view_manager' => [
        'template_path_stack' => [
            sprintf('%s/../view', __DIR__),
        ],
    ],
    'block_layouts' => [
        'invokables' => [
            'web_monetization' => BlockLayout\WebMonetization::class,
        ],
    ],
    'view_helpers' => [
        'factories' => [
            'webMonetization' => Service\ViewHelper\WebMonetizationFactory::class,
        ],
    ],
];
