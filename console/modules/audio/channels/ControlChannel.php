<?php

namespace console\modules\audio\channels;

use console\modules\audio\transport\TransportProvider;
use Evenement\EventEmitterTrait;
use React\EventLoop\LoopInterface;
use Thruway\Peer\Router;
use Thruway\Session;
use yii\base\Object;

class ControlChannel extends Object {
    use EventEmitterTrait;
    private $_router;
    private $_transport;

    public function __construct($realm, LoopInterface $loop = null, $config = []) {
        parent::__construct($config);
        $this->_router = new Router($loop);
        $this->_transport = new TransportProvider("127.0.0.1", 8889);
        $this->_router->addTransportProvider($this->_transport);
        $this->_router->addInternalClient(new Client($this, $realm, $loop));
    }

    public function init() {
        parent::init();
    }

    public function getComponent() {
        return $this->_transport;
    }
}

class Client extends \Thruway\Peer\Client {
    private $_channel;

    public function __construct(ControlChannel $channel, $realm, LoopInterface $loop = null) {
        parent::__construct($realm, $loop);
        $this->_channel = $channel;
    }

    public function onSessionStart($session, $transport) {
        $this->_channel->emit('start', [$session, $transport]);
    }

    public function onSessionEnd($session) {
        $this->_channel->emit('end', [$session]);
    }
}