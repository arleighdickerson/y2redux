<?php


namespace console\modules\uploadstream\controllers;

use console\modules\uploadstream\components\BinaryStream;
use console\modules\uploadstream\components\EventEmittingComponent;
use console\modules\uploadstream\components\StreamComponentAdapter;
use console\modules\uploadstream\Module;
use console\modules\uploadstream\util\Debug;
use Ratchet;
use Ratchet\ConnectionInterface;
use React;
use yii\console\Controller;
use yii\helpers\Json;

/**
 * Class ServerController
 * @package console\modules\uploadstream\controllers
 * @property \console\modules\uploadstream\Module $module
 * @property Ratchet\ConnectionInterface[] $connections
 */
class ServerController extends Controller {
    /**
     * @var \SplObjectStorage
     */
    private $_browsers;

    /**
     * @var EventEmittingComponent
     */
    private $_emitter;

    /**
     * @var StreamComponentAdapter
     */
    private $_adapter;

    public function init() {
        parent::init();

        $this->_browsers = new \SplObjectStorage();
        $this->_emitter = new EventEmittingComponent();
        $this->_adapter = new StreamComponentAdapter($this->_emitter);

        $this->_emitter->onAll(function (ConnectionInterface $connection) {
        });

        $this->_emitter->on('open', function (ConnectionInterface $conn) {
            $this->_browsers->attach($conn);
        });

        // forward non-binary messages back to the emitter as actions
        $this->_emitter->on('message', function (ConnectionInterface $from, $msg) {
            $action = Json::decode($msg);
            $this->_emitter->emit($action['type'], [$from, $action]);
        });

        // handle inbound (upload) streams
        $this->_emitter->on('stream', function (ConnectionInterface $conn, BinaryStream $in, array $meta) {
            foreach ($this->_browsers as $client) {
                if ($client !== $conn) {
                    $out = $this->createOutputStream($conn, $meta);
                    $in->pipe($out);
                }
            }
        });
        $this->_emitter->on('close', function (ConnectionInterface $connection) {
        });

        $this->_emitter->onAll(function (ConnectionInterface $connection) {
        });

        if (YII_DEBUG) {
            Debug::sinkServer('wss', $this->_emitter);
        }
    }

    public function actionIndex() {
        $app = new Ratchet\App('localhost', 8889, '0.0.0.0', loop());
        $app->route('/', $this->_adapter, ['*']);
        $app->run();
    }


    /**
     * Send a readable stream over the wire via a socket connection
     *
     * @param ConnectionInterface $connection
     * @param array|null $meta
     *
     * @return BinaryStream
     */
    protected function createOutputStream(ConnectionInterface $connection, array $meta) {
        $create = true;
        return $this->_adapter->attachStream(
            new BinaryStream($connection, $this->_adapter->nextId(), compact('create', 'meta'))
        );
    }

    /**
     * @param ConnectionInterface $connection
     * @param null $identity
     * @return bool
     */
    public function isAuthorized(ConnectionInterface $connection, &$identity = null) {
        return true;
    }
}
