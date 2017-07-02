<?php


namespace console\modules\uploadstream;


use yii\helpers\StringHelper;

class Module extends \yii\base\Module {
    public $httpHost = 'localhost';
    public $port = 8889;
    public $address = '0.0.0.0';
    public $protocol = 'ws';

    public function init() {
        \Yii::$classMap['Ratchet\WebSocket\Version\RFC6455'] = __DIR__ . '/monkeypatch/RFC6455.php';
        \Yii::$classMap['Ratchet\WebSocket\Version\RFC6455\Connection'] = __DIR__ . '/monkeypatch/Connection.php';
        require_once(__DIR__ . '/ratchet-patch.php');
        parent::init();
    }

    public static function resolveIPFromHostsFile($hostname) {
        foreach (explode(PHP_EOL, file_get_contents("/etc/hosts")) as $line) {
            if (StringHelper::endsWith(trim($line), $hostname)) {
                return str_replace($hostname, '', preg_replace('/\s+/', '', $line));
            }
        }
        return null;
    }
}
