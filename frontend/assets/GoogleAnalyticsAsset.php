<?php


namespace frontend\assets;

use JShrink\Minifier;
use yii\web\AssetBundle;
use yii\web\View;

class GoogleAnalyticsAsset extends AssetBundle {
    public $id;

    public function registerAssetFiles($view) {
        if (($id = $this->getId())) {
            $view->registerJs($this->getJsFragment(), View::POS_HEAD);
        }
    }

    protected function getJsFragment() {
        return <<<JS
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', '{$this->id}', 'auto');ga('send', 'pageview');
JS;
    }

    public function getId() {
        return $this->id ?: secret('google.analytics.id', false);
    }
}
