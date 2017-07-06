<?php


namespace console\modules\audio\components;


use Evenement\EventEmitterInterface;
use Evenement\EventEmitterTrait;
use Ratchet\ConnectionInterface;

class EventEmittingComponent implements StreamComponentInterface, BinaryComponentInterface, EventEmitterInterface {
    use EventEmitterTrait;

    public function onOpen(ConnectionInterface $conn) {
        $this->emit('open', [$conn]);
    }

    public function onClose(ConnectionInterface $conn) {
        $this->emit('close', [$conn]);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        $this->emit('error', [$conn, $e]);
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $this->emit('message', [$from, $msg]);
    }

    public function onBinaryMessage(ConnectionInterface $from, $msg) {
        $this->emit('binaryMessage', [$from, $msg]);
    }

    public function onStream(ConnectionInterface $connection, BinaryStream $stream, array $meta) {
        $this->emit('stream', [$connection, $stream, $meta]);
    }
}
