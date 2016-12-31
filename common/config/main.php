<?php

return [
    'vendorPath' => dirname(dirname(__DIR__)) . '/vendor',
    'components' => [
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'dispatcher' => [
            'class' => 'common\components\Dispatcher'
        ]
    ],
];
