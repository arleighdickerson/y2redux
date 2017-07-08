<?php

namespace console\modules\audio\channels;

use console\modules\audio\components\BinaryStream;
use console\modules\audio\components\EventEmittingComponent;
use console\modules\audio\components\StreamComponentAdapter;
use console\modules\audio\util\Debug;
use Evenement\EventEmitterInterface;
use Ratchet\ConnectionInterface;
use yii\helpers\ArrayHelper;

class DataChannel extends StreamComponentAdapter {
    /**
     * @var \SplObjectStorage
     */
    private $_clients;

    public function __construct() {
        parent::__construct(new EventEmittingComponent());
        $this->_clients = new \SplObjectStorage();

        $this->getEmitter()->on('open', function (ConnectionInterface $conn) {
            $username = $this->getQueryStringData($conn, 'username');
            $this->_clients->offsetSet($conn, $username ?: 'an0n');
        });
        $this->getEmitter()->on('stream', function (ConnectionInterface $conn, BinaryStream $in, array $meta) {
            // handle inbound (upload) streams
            foreach ($this->_clients as $client) {
                //if ($client !== $conn) {
                $out = $this->createOutputStream($client, $meta);
                $in->pipe($out);
                //}
            }
        });
        $this->getEmitter()->on('close', function (ConnectionInterface $conn) {
            foreach ($this->getStreams() as $stream) {
                /** @var BinaryStream $stream */
                if ($stream->getClient() === $conn) {
                    $stream->end();
                    $stream->close();
                }
            }
            $this->_clients->detach($conn);
        });
        if (YII_DEBUG) {
            Debug::sinkServer('wss', $this->getEmitter());
        }
    }

    public function getComponent() {
        return $this;
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
        return $this->attachStream(
            new BinaryStream($conn, $this->nextId(), compact('create', 'meta'))
        );
    }

    protected function getQueryStringData(ConnectionInterface $conn, $key = null, $default = null) {
        return ArrayHelper::getValue(
            $conn,
            'wrappedConn.WebSocket.request.url.query.data' . ($key === null ? '' : ".$key"),
            $default
        );
    }

    /**
     * @return EventEmitterInterface
     */
    protected function getEmitter() {
        return $this->unwrap();
    }
}