<?php


namespace console\modules\audio\transport;


use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\MessageComponentInterface;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\Version\RFC6455\Frame;
use Ratchet\WebSocket\WsServer;
use Ratchet\WebSocket\WsServerInterface;
use React\Socket\Server as Reactor;
use Thruway\Event\ConnectionCloseEvent;
use Thruway\Event\ConnectionOpenEvent;
use Thruway\Event\RouterStartEvent;
use Thruway\Event\RouterStopEvent;
use Thruway\Exception\DeserializationException;
use Thruway\Logging\Logger;
use Thruway\Message\HelloMessage;
use Thruway\Serializer\JsonSerializer;
use Thruway\Session;
use Thruway\Transport\AbstractRouterTransportProvider;
use yii\helpers\ArrayHelper;

/**
 * Class TransportProvider
 *
 * @package Thruway\Transport
 */
class TransportProvider extends AbstractRouterTransportProvider implements MessageComponentInterface, WsServerInterface {
    /**
     * @var string
     */
    private $address;

    /**
     * @var string|int
     */
    private $port;

    /**
     * @var \Ratchet\Server\IoServer
     */
    private $server;

    /**
     * @var \SplObjectStorage
     */
    private $sessions;


    /**
     * Constructor
     *
     * @param string $address
     * @param string|int $port
     */
    public function __construct($address = "127.0.0.1", $port = 8080) {
        $this->port = $port;
        $this->address = $address;
        $this->sessions = new \SplObjectStorage();
    }

    /**
     * Interface stuff
     */

    /** @inheritdoc */
    public function getSubProtocols() {
        return [
            'wamp.2.json',
            'wamp.2.msgpack'
        ];
    }


    /** @inheritdoc */
    public function onOpen(ConnectionInterface $conn) {
        Logger::debug($this, "TransportProvider::onOpen");

        $transport = new Transport($conn, $this->loop);

        // this will need to be a little more dynamic at some point
        $transport->setSerializer(new JsonSerializer());

        $transport->setTrusted($this->trusted);

        $session = $this->router->createNewSession($transport);

        $this->sessions->attach($conn, $session);

        $this->router->getEventDispatcher()->dispatch("connection_open", new ConnectionOpenEvent($session));
    }

    /** @inheritdoc */
    public function onClose(ConnectionInterface $conn) {
        /** @var Session $session */
        $session = $this->sessions[$conn];

        $this->sessions->detach($conn);

        $this->router->getEventDispatcher()->dispatch('connection_close', new ConnectionCloseEvent($session));

        unset($this->sessions[$conn]);

        Logger::debug($this, "Ratchet has closed");
    }

    /** @inheritdoc */
    public function onError(ConnectionInterface $conn, \Exception $e) {
        Logger::error($this, "onError...");
        // TODO: Implement onError() method.
    }

    /** @inheritdoc */
    public function onMessage(ConnectionInterface $from, $msg) {
        Logger::debug($this, "onMessage: ({$msg})");
        /** @var Session $session */
        $session = $this->sessions[$from];

        try {
            //$this->router->onMessage($transport, $transport->getSerializer()->deserialize($msg));
            $msg = $session->getTransport()->getSerializer()->deserialize($msg);

            if ($msg instanceof HelloMessage) {

                $details = $msg->getDetails();

                $details->transport = (object)$session->getTransport()->getTransportDetails();

                $msg->setDetails($details);
            }

            $session->dispatchMessage($msg);
        } catch (DeserializationException $e) {
            Logger::alert($this, "Deserialization exception occurred.");
        } catch (\Exception $e) {
            Logger::alert($this, "Exception occurred during onMessage: " . $e->getMessage());
        }
    }

    /** @inheritdoc */
    public function onBinaryMessage(ConnectionInterface $from, $msg) {
        Logger::debug($this, "onBinaryMessage: ({$msg})");
        /** @var Session $session */
        $session = $this->sessions[$from];

        try {
            //$this->router->onMessage($transport, $transport->getSerializer()->deserialize($msg));
            $msg = $session->getTransport()->getSerializer()->deserialize($msg);

            if ($msg instanceof HelloMessage) {

                $details = $msg->getDetails();

                $details->transport = (object)$session->getTransport()->getTransportDetails();

                $msg->setDetails($details);
            }

            $session->dispatchMessage($msg);
        } catch (DeserializationException $e) {
            Logger::alert($this, "Deserialization exception occurred.");
        } catch (\Exception $e) {
            Logger::alert($this, VarDumper::dumpAsString($e));
        }
    }

    /**
     * Handle on pong
     *
     * @param \Ratchet\ConnectionInterface $from
     * @param \Ratchet\WebSocket\Version\RFC6455\Frame $frame
     */
    public function onPong(ConnectionInterface $from, Frame $frame) {
        $transport = $this->sessions[$from];

        if (method_exists($transport, 'onPong')) {
            $transport->onPong($frame);
        }
    }

    public function handleRouterStart(RouterStartEvent $event) {
        $ws = new WsServer($this);
        $ws->disableVersion(0);

        $socket = new Reactor($this->loop);
        $socket->listen($this->port, $this->address);

        Logger::info($this, "Websocket listening on " . $this->address . ":" . $this->port);

        $this->server = new IoServer(new HttpServer($ws), $socket, $this->loop);
    }

    public function handleRouterStop(RouterStopEvent $event) {
        if ($this->server) {
            $this->server->socket->shutdown();
        }

        foreach ($this->sessions as $k) {
            $this->sessions[$k]->shutdown();
        }
    }

    public static function getSubscribedEvents() {
        return [
            "router.start" => ["handleRouterStart", 10],
            "router.stop" => ["handleRouterStop", 10]
        ];
    }
}
