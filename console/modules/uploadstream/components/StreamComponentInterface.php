<?php

namespace console\modules\uploadstream\components;

use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;

interface StreamComponentInterface extends MessageComponentInterface {
    function onStream(ConnectionInterface $connection, BinaryStream $stream, $meta);
}
