<?php

use frontend\components\ReactFormatter;
use frontend\controllers\IsomorphicController;
use frontend\widgets\React;

$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'app-frontend',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log', 'routeManager'],
    'controllerNamespace' => 'frontend\controllers',
    'modules' => [
        'api' => 'frontend\modules\api\Module',
        'routeManager' => [
            'class' => 'frontend\modules\routing\Module',
            'routes' => function ($manager) {
                require(__DIR__ . '/routes.php');
            },
        ]
    ],
    'components' => [
        'request' => [
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ]
        ],
        'errorHandler' => [
            'errorAction' => 'default/error',
        ],
        'session' => ['class' => 'yii\web\DbSession'],
        'user' => [
            'identityClass' => 'common\models\User',
            'enableAutoLogin' => true,
        ],
        'urlManager' => [
            'class' => 'yii\web\UrlManager',
            'enableStrictParsing' => true,
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            //'rules' => require(__DIR__ . '/rules.php')
        ],
    ],
    'params' => $params
];
