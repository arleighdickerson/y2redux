<?php
/**
 * @author Arleigh Dickerson
 */

namespace maintenance;


use common\assets\GoogleAnalyticsAsset;
use yii\web\AssetBundle;

class MaintenanceAsset extends AssetBundle {
    public function init() {
        parent::init();
        $this->sourcePath = __DIR__ . DIRECTORY_SEPARATOR . 'assets';
    }

    public $depends = [
        GoogleAnalyticsAsset::class
    ];
}