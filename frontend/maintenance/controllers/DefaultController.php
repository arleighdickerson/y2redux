<?php
namespace maintenance\controllers;

use common\assets\GoogleAnalyticsAsset;
use yii\web\Controller;

class DefaultController extends Controller {
    public function actionIndex() {
        GoogleAnalyticsAsset::register($this->getView());
        return 'down for maintenance...';
    }
}
