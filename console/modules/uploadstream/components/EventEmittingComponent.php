<?php


namespace console\modules\uploadstream\components;


use common\helpers\ReflectionTrait;
use Evenement\EventEmitterInterface;
use Evenement\EventEmitterTrait;
use Ratchet\ConnectionInterface;

class EventEmittingComponent implements StreamComponentInterface, BinaryComponentInterface, EventEmitterInterface {
    use EventEmitterTrait;
    use ReflectionTrait;

    const EVENT_OPEN = 'open';
    const EVENT_CLOSE = 'close';
    const EVENT_ERROR = 'error';
    const EVENT_MESSAGE = 'message';
    const EVENT_BINARY_MESSAGE = 'binaryMessage';
    const EVENT_STREAM = 'stream';

    function onOpen(ConnectionInterface $conn) {
        $this->emit(static::EVENT_OPEN, [$conn]);
    }

    function onClose(ConnectionInterface $conn) {
        $this->emit(static::EVENT_CLOSE, [$conn]);
    }

    function onError(ConnectionInterface $conn, \Exception $e) {
        $this->emit(static::EVENT_ERROR, [$conn, $e]);
    }

    function onMessage(ConnectionInterface $from, $msg) {
        $this->emit(static::EVENT_MESSAGE, [$from, $msg]);
    }

    function onStream(ConnectionInterface $connection, BinaryStream $stream, $meta) {
        $this->emit(static::EVENT_STREAM, [$connection, $stream, $meta]);
    }

    function onBinaryMessage(ConnectionInterface $from, $msg) {
        $this->emit(static::EVENT_BINARY_MESSAGE, [$from, $msg]);
    }

    function onAll(callable $listener, $except = []) {
        foreach (static::getConstants('EVENT_') as $name) {
            if (!in_array($name, $except)) {
                $this->on($name, $listener);
            }
        }
    }
}
