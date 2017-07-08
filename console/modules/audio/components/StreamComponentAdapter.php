<?php


namespace console\modules\audio\components;

use Ratchet\ConnectionInterface;

class StreamComponentAdapter implements StreamComponentInterface, BinaryComponentInterface {
    use BinaryHandlers;

    /**
     * @var StreamComponentInterface
     */
    private $_component;

    public function __construct(StreamComponentInterface $component) {
        $this->_component = $component;
    }

    function onOpen(ConnectionInterface $conn) {
        $this->_component->onOpen($conn);
    }

    function onClose(ConnectionInterface $conn) {
        $this->_component->onClose($conn);
    }

    function onError(ConnectionInterface $conn, \Exception $e) {
        $this->_component->onError($conn, $e);
    }

    function onMessage(ConnectionInterface $from, $msg) {
        $this->_component->onMessage($from, $msg);
    }

    function onStream(ConnectionInterface $connection, BinaryStream $stream, array $meta) {
        $this->_component->onStream($connection, $stream, $meta);
    }

    protected function unwrap(){
        return $this->_component;
    }
}
