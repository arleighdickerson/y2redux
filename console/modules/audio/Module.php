<?php


namespace console\modules\audio;


use yii\helpers\StringHelper;

class Module extends \yii\base\Module {
    public function init() {
        require_once(__DIR__. '/ratchet-patch.php');
        \Yii::$classMap['Ratchet\WebSocket\Version\RFC6455'] = __DIR__ . '/monkeypatch/RFC6455.php';
        \Yii::$classMap['Ratchet\WebSocket\Version\RFC6455\Connection'] = __DIR__ . '/monkeypatch/Connection.php';
        parent::init();
    }
}
