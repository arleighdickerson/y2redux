<?php

namespace frontend\assets;

use yii\web\AssetBundle;

/**
 * Main frontend application asset bundle.
 */
class AppAsset extends AssetBundle {
    public $basePath = '@webroot/assets';
    public $baseUrl = '@web/assets';
    public $css = [];
    public $js = [];
    public $depends = [
        GoogleAnalyticsAsset::class,
        GoogleRecaptchaAsset::class
    ];
}
