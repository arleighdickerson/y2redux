<?php


namespace console\modules\uploadstream\controllers;

use assetserver\modules\canonicalcaching as caching;
use assetserver\modules\canonicalcaching\Module;
use assetserver\modules\canonicalcaching\Util;
use console\controllers\ProcessManager;
use console\modules\uploadstream\components\BinaryHandlers;
use console\modules\uploadstream\components\BinaryStream;
use console\modules\uploadstream\components\Codec;
use console\modules\uploadstream\util\Debug;
use Ratchet;
use yii\base\ErrorException;
use yii\console\Controller;
use yii\helpers\ArrayHelper;
use yii\helpers\Json;

/**
 * Class ClientController
 * @package console\modules\uploadstream\controllers
 * @property \console\modules\uploadstream\Module $module
 */
class ClientController extends Controller implements Ratchet\ConnectionInterface {
    use BinaryHandlers;

    /**
     * @var Ratchet\Client\WebSocket
     */
    private $_ws;

    public function getWs() {
        return $this->_ws;
    }

    public function actionIndex() {
        $url = "{$this->module->protocol}://{$this->module->address}:{$this->module->port}";
        call_user_func(new Ratchet\Client\Factory(loop()), $url)
            ->then(
                [$this, 'runSocket'],
                [$this, 'couldNotOpen']
            );
        loop()->run();
    }

    public function runSocket(Ratchet\Client\WebSocket $ws) {
        $this->_ws = $ws;
        if (YII_DEBUG) {
            Debug::sinkClient('ws', $ws);
        }
        $ws->on('message', [$this, 'onMessage']);
        $ws->on('error', ['Yii', 'error']);
        $ws->on('stream', function (Ratchet\ConnectionInterface $connection, BinaryStream $stream, $meta) {
        });
    }

    public function onMessage($msg) {
        try {
            $unpacked = Codec::decode($msg);
            list($type, $payload, $bonus) = $unpacked;
            $this->invokeHandler($type, $payload, $bonus);
        } catch (ErrorException $e) {
            $action = Json::decode($msg);
            $this->_ws->emit($action['type'], [$action]);
        }
    }

    public function onStream(Ratchet\ConnectionInterface $connection, BinaryStream $stream, $meta) {
        $this->_ws->emit('stream', [$connection, $stream, $meta]);
    }

    public function couldNotOpen(\Exception $e) {
        $this->stderr("Could not connect: {$e->getMessage()}");
    }

    public function getClient() {
        return $this;
    }

    protected function sendAction(array $action = []) {
        $this->_ws->send(Json::encode($action));
    }

    public function sendBinary() {
        // NO-OP
    }

    public function close() {
        // NO-OP
    }
}
