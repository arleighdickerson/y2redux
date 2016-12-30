<?php
namespace maintenance;

use Yii;
use yii\base\Application;
use yii\base\BootstrapInterface;

class Module extends \yii\base\Module implements BootstrapInterface {
    public static $maintenanceFile = "@console/runtime/maintenance.on";
    public $controllerNamespace = 'maintenance\controllers';
    public $defaultRoute = 'default/index';

    public static function isDown() {
        return file_exists(Yii::getAlias(self::$maintenanceFile));
    }

    /**
     * Bootstrap method to be called during application bootstrap stage.
     * @param Application $app the application currently running
     */
    public function bootstrap($app) {
        if (self::isDown()) {
            $app->catchAll = ['maintenance/default/index'];
        }
    }
}
