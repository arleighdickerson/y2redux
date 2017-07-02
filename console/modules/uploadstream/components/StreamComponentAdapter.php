<?php


namespace console\modules\uploadstream\components;

use Ratchet\ConnectionInterface;

class StreamComponentAdapter implements StreamComponentInterface, BinaryComponentInterface {
    use BinaryHandlers;

    /**
     * @var StreamComponentInterface
     */
    private $_component;

    /**
     * @var ConnectionInterface
     */
    private $_current;

    public function __construct(StreamComponentInterface $component) {
        $this->_component = $component;
    }

    function onOpen(ConnectionInterface $conn) {
        $this->_current = $conn;
        $this->_component->onOpen($conn);
        $this->_current = null;
    }

    function onClose(ConnectionInterface $conn) {
        $this->_current = $conn;
        $this->_component->onClose($conn);
        $this->_current = null;
    }

    function onError(ConnectionInterface $conn, \Exception $e) {
        $this->_current = $conn;
        $this->_component->onError($conn, $e);
        $this->_current = null;
    }

    function onMessage(ConnectionInterface $from, $msg) {
        $this->_current = $from;
        $this->_component->onMessage($from, $msg);
        $this->_current = null;
    }

    function onStream(ConnectionInterface $connection, BinaryStream $stream, $meta) {
        $this->_component->onStream($connection, $stream, $meta);
    }

    function onBinaryMessage(ConnectionInterface $from, $msg) {
        $this->_current = $from;
        try {
            if (method_exists($this->_component, 'onBinaryMessage')) {
                $this->_component->onBinaryMessage($from, $msg);
            }
            $unpacked = Codec::decode($msg);
            list($type, $payload, $bonus) = $unpacked;
            $this->invokeHandler($type, $payload, $bonus);
        } catch (\Exception $e) {
            $this->onError($from, $e);
        }
        $this->_current = null;
    }


    protected function getClient() {
        return $this->_current;
    }
}
