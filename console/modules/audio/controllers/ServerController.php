<?php


namespace console\modules\audio\controllers;

use console\modules\audio\components\BinaryStream;
use console\modules\audio\components\EventEmittingComponent;
use console\modules\audio\components\StreamComponentAdapter;
use console\modules\audio\util\Debug;
use Guzzle\Http\Message\RequestInterface;
use ProxyManager\Factory\AccessInterceptorValueHolderFactory;
use Ratchet;
use Ratchet\ConnectionInterface;
use React;
use Symfony\Component\HttpFoundation\JsonResponse;
use yii\base\ErrorException;
use yii\console\Controller;
use yii\helpers\ArrayHelper;
use yii\helpers\Json;


/**
 * Class ServerController
 * @package console\modules\audio\controllers
 * @property \console\modules\audio\Module $module
 * @property Ratchet\ConnectionInterface[] $conns
 */
class ServerController extends Controller {
    /**
     * @var \SplObjectStorage
     */
    private $_clients;

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

        $this->_clients = new \SplObjectStorage();
        $this->_emitter = new EventEmittingComponent();
        $this->_adapter = new StreamComponentAdapter($this->_emitter);

        $this->_emitter->on('open', function (ConnectionInterface $conn) {
            $username = $this->getQueryStringData($conn, 'username');
            $this->_clients->offsetSet($conn, $username ?: 'an0n');
        });

        $this->_emitter->on('message', function (ConnectionInterface $from, $msg) {
            // forward non-binary messages back to the emitter as actions
            $action = Json::decode($msg);
            $this->_emitter->emit($action['type'], [$from, $action]);
        });

        $this->_emitter->on('stream', function (ConnectionInterface $conn, BinaryStream $in, array $meta) {
            // handle inbound (upload) streams
            foreach ($this->_clients as $client) {
                if ($client !== $conn) {
                    $out = $this->createOutputStream($client, $meta);
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
            $this->_clients->detach($conn);
        });

        if (YII_DEBUG) {
            Debug::sinkServer('wss', $this->_emitter);
        }

        loop()->nextTick(function () {
            $this->patchErrorHandler();
        });

    }

    public function actionIndex() {
        /*
        $ws = new WsServer($this->_adapter);
        $ws->disableVersion(0); // old, bad, protocol version
        $http = new HttpServer($ws);
        $socket = new React\Socket\Server(loop());
        $socket->listen(8889, '0.0.0.0');
        $io = new IoServer($http, $socket, loop());
        */

        $app = new Ratchet\App('localhost', 8889, '0.0.0.0', loop());
        $app->route('/', $this->_adapter, ['*']);
        $app->route('/who/', new Http($this->_clients), ['*']);
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

    protected function getQueryStringData(ConnectionInterface $conn, $key = null, $default = null) {
        return ArrayHelper::getValue(
            $conn,
            'wrappedConn.WebSocket.request.url.query.data' . ($key === null ? '' : ".$key"),
            $default
        );
    }
}

class Http implements Ratchet\Http\HttpServerInterface {
    private $_clients;

    function __construct($clients) {
        $this->_clients = $clients;
    }

    function getUsernames() {
        foreach ($this->_clients as $conn) {
            yield $this->_clients->offsetGet($conn);
        }
    }

    function onClose(ConnectionInterface $conn) {
        $this->close($conn);
    }

    function onError(ConnectionInterface $conn, \Exception $e) {
    }

    public function onOpen(ConnectionInterface $conn, RequestInterface $request = null) {
        $this->sendUsernames($conn);
    }

    function onMessage(ConnectionInterface $from, $msg) {
    }

    protected function sendUsernames($conn) {
        return $this->close($conn, iterator_to_array($this->getUsernames()));
    }

    protected function close(ConnectionInterface $conn, $data = null, $code = 200) {
        $response = new JsonResponse(Json::encode($data));
        $response->setEncodingOptions(320);
        $response->setStatusCode($code);
        $conn->send((string)$response);
        $conn->close();
    }
}
