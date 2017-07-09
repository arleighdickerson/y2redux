<?php

use console\modules\audio\components\BinaryStream;
use console\modules\audio\components\EventEmittingComponent;
use console\modules\audio\components\StreamComponentAdapter;
use console\modules\audio\util\Debug;
use Ratchet\ConnectionInterface;

return call_user_func(function () {
    $clients = new SplObjectStorage();
    $emitter = new EventEmittingComponent();
    $adapter = new StreamComponentAdapter($emitter);

    $emitter->on('open', function (ConnectionInterface $conn) use ($clients) {
        $clients->attach($conn);
    });

    $emitter->on('stream', function (ConnectionInterface $conn, BinaryStream $in, array $meta) use ($clients, $adapter) {
        // handle inbound (upload) streams
        foreach ($clients as $client) {
            if ($client !== $conn) {
                $out = $adapter->createStream($conn, $meta);
                $in->pipe($out);
            }
        }
    });
    $emitter->on('close', function (ConnectionInterface $conn) use ($adapter, $clients) {
        foreach ($adapter->getStreams() as $stream) {
            /** @var BinaryStream $stream */
            if ($stream->getClient() === $conn) {
                $stream->end();
                $stream->close();
            }
        }
        $clients->detach($conn);
    });

    if (YII_DEBUG) {
        Debug::sinkServer('wss', $emitter);
    }

    return $adapter;
});
