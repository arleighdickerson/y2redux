<?php


namespace frontend\assets;

use JShrink\Minifier;
use yii\web\AssetBundle;
use yii\web\View;

class GoogleRecaptchaAsset extends AssetBundle {
    public $siteKey;

    public $js = [
        '//www.google.com/recaptcha/api.js'
    ];

    public $jsOptions = [
        'async' => true,
        'defer' => true,
        'position' => View::POS_HEAD
    ];

    public function registerAssetFiles($view) {
        if ($this->getSiteKey()) {
            parent::registerAssetFiles($view);
        }
    }

    public function getSiteKey() {
        return $this->siteKey ?: secret('google.recaptcha.siteKey', false);
    }
}
