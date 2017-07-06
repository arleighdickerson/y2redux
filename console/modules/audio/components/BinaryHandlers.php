<?php


namespace console\modules\audio\components;

use Ratchet\ConnectionInterface;

trait BinaryHandlers {
    private $_nextId = 1;
    private $_streams = [];

    /**
     * @param ConnectionInterface $conn
     * @param BinaryStream $stream
     * @param array $meta
     * @return void
     */
    public abstract function onStream(
        ConnectionInterface $conn,
        BinaryStream $stream,
        array $meta
    );

    /**
     * @param ConnectionInterface $conn
     * @param \Exception $e
     * @return void
     */
    public abstract function onError(ConnectionInterface $conn, \Exception $e);

    /**
     * @return BinaryStream[]
     */
    public function getStreams() {
        return $this->_streams;
    }

    /**
     * @param ConnectionInterface $from
     * @param string $msg (binary)
     */
    public function onBinaryMessage(ConnectionInterface $from, $msg) {
        list($type, $payload, $bonus) = Codec::decode($msg);
        $this->invokeHandler($from, $type, $payload, $bonus);
    }

    /**
     * @param ConnectionInterface $conn
     * @param $meta
     * @return BinaryStream
     */
    public function createStream(ConnectionInterface $conn, array $meta) {
        $create = true;
        $stream = $this->attachStream(
            new BinaryStream($conn, $this->nextId(), compact('create', 'meta'))
        );
        return $stream;
    }

    /**
     * @param ConnectionInterface $conn
     * @param int $streamId
     * @return BinaryStream
     */
    public function receiveStream(ConnectionInterface $conn, $streamId) {
        return $this->attachStream(new BinaryStream($conn, $streamId));
    }

    /**
     * @param BinaryStream $stream
     * @return BinaryStream
     */
    public function attachStream(BinaryStream $stream) {
        $stream->on('close', function () use ($stream) {
            unset($this->_streams[$stream->getId()]);
        });
        $this->_streams[$stream->getId()] = $stream;
        return $stream;
    }

    /**
     * @return int
     */
    protected function nextId() {
        $id = $this->_nextId;
        $this->_nextId = $id + 2;
        return $id;
    }

    /**
     * @param ConnectionInterface $conn
     * @param $type
     * @param $payload
     * @param $streamId
     */
    protected function invokeHandler(ConnectionInterface $conn, $type, $payload, $streamId) {
        /** @var BinaryStream|null $stream */
        $stream = isset($this->_streams[$streamId]) ? $this->_streams[$streamId] : null;
        switch ($type) {
            case BinaryStream::PAYLOAD_RESERVED:
                return;
            case BinaryStream::PAYLOAD_NEW_STREAM:
                $stream = $this->receiveStream($conn, $streamId);
                $this->onStream($conn, $stream, $payload);
                return;
            case BinaryStream::PAYLOAD_DATA:
                $stream
                    ? $stream->onData($payload)
                    : $this->streamNotFound($conn, $streamId, 'data');
                return;
            case BinaryStream::PAYLOAD_PAUSE:
                $stream
                    ? $stream->onPause()
                    : $this->streamNotFound($conn, $streamId, 'pause');
                return;
            case BinaryStream::PAYLOAD_RESUME:
                $stream
                    ? $stream->onResume()
                    : $this->streamNotFound($conn, $streamId, 'resume');
                return;
            case BinaryStream::PAYLOAD_END:
                $stream
                    ? $stream->onEnd()
                    : $this->streamNotFound($conn, $streamId, 'end');
                return;
            case BinaryStream::PAYLOAD_CLOSE:
                $stream
                    ? $stream->onClose()
                    : $this->streamNotFound($conn, $streamId, 'close');
                return;
            default:
                $this->raiseError($conn, "Unrecognized message type received: $type");
        }
    }

    private function raiseError(ConnectionInterface $conn, $msg) {
        $this->onError($conn, new \Exception($msg));
    }

    private function streamNotFound(ConnectionInterface $conn, $streamId, $payloadType) {
        $this->raiseError($conn, "Received `$payloadType` message for unknown stream with id `$streamId`");
    }
}
