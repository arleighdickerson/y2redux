<?php


namespace console\modules\uploadstream\controllers;

use console\modules\uploadstream\components\BinaryStream;
use console\modules\uploadstream\components\EventEmittingComponent;
use console\modules\uploadstream\components\StreamComponentAdapter;
use console\modules\uploadstream\Module;
use console\modules\uploadstream\util\Debug;
use ProxyManager\Factory\AccessInterceptorValueHolderFactory;
use Ratchet;
use Ratchet\ConnectionInterface;
use React;
use yii\base\ErrorException;
use yii\base\Exception;
use yii\console\Controller;
use yii\helpers\Json;

/**
 * Class ServerController
 * @package console\modules\uploadstream\controllers
 * @property \console\modules\uploadstream\Module $module
 * @property Ratchet\ConnectionInterface[] $conns
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

        $this->_emitter->onAll(function (ConnectionInterface $conn) {
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
        $this->_emitter->on('close', function (ConnectionInterface $conn) {
            foreach ($this->_adapter->getStreams() as $stream) {
                /** @var BinaryStream $stream */
                if ($stream->getClient() === $conn) {
                    $stream->end();
                    $stream->close();
                }
            }
            $this->_browsers->detach($conn);
        });

        $this->_emitter->onAll(function (ConnectionInterface $conn) {
        });

        if (YII_DEBUG) {
            Debug::sinkServer('wss', $this->_emitter);
        }

        loop()->nextTick(function () {
            $this->patchErrorHandler();
        });

    }

    public function actionIndex() {
        $app = new Ratchet\App('localhost', 8889, '0.0.0.0', loop());
        $app->route('/', $this->_adapter, ['*']);
        $app->run();
    }


    /**
     * Send a readable stream over the wire via a socket connection
     *
     * @param ConnectionInterface $conn
     * @param array|null $meta
     *
     * @return BinaryStream
     */
    protected function createOutputStream(ConnectionInterface $conn, array $meta) {
        $create = true;
        return $this->_adapter->attachStream(
            new BinaryStream($conn, $this->_adapter->nextId(), compact('create', 'meta'))
        );
    }

    protected function patchErrorHandler() {
        /** @var AccessInterceptorValueHolderFactory $proxyFactory */
        $proxyFactory = \Yii::$container->get(AccessInterceptorValueHolderFactory::class);
        $handler = \Yii::$app->errorHandler;
        $handleException = function ($proxy, $instance, $method, $params, & $returnEarly) {
            $exception = null;
            extract($params, EXTR_OVERWRITE);
            static $messageIncludes = 'unable to shutdown socket';
            if ($exception instanceof ErrorException && strpos($exception->getMessage(), $messageIncludes) !== false) {
                $returnEarly = true;
                return;
            }
        };
        $handler->unregister();
        $proxy = $proxyFactory->createProxy($handler, compact('handleException'), []);
        \Yii::$app->set('errorHandler', $proxy);
    }
}
