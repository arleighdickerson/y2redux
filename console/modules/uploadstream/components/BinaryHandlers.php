<?php


namespace console\modules\uploadstream\components;


use Ratchet\ConnectionInterface;

trait BinaryHandlers {
    private $_nextId = 1;
    private $_streams = [];

    protected abstract function getClient();

    public abstract function onStream(ConnectionInterface $connection, BinaryStream $stream, $meta);

    /**
     * @param $data
     * @param array $meta
     * @return BinaryStream
     */
    public function send($data, $meta = []) {
        $stream = $this->createStream($meta);
        $stream->write($data);
        return $stream;
    }

    /**
     * @return BinaryStream[]
     */
    public function getStreams() {
        return $this->_streams;
    }

    /**
     * @param $streamId
     * @return BinaryStream
     */
    public function receiveStream($streamId) {
        return $this->attachStream(new BinaryStream($this->getClient(), $streamId));
    }

    /**
     * @param $meta
     * @return BinaryStream
     */
    public function createStream($meta = []) {
        $create = true;
        $stream = $this->attachStream(
            new BinaryStream($this->getClient(), $this->nextId(), compact('create', 'meta'))
        );
        return $stream;
    }

    public function nextId() {
        $id = $this->_nextId;
        $this->_nextId += 2;
        return $id;
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

    private static $_binaryHandlers;

    public function invokeHandler($type, $payload, $bonus) {
        if (self::$_binaryHandlers === null) {
            self::$_binaryHandlers = self::createHandlers();
        }
        call_user_func(self::$_binaryHandlers[$type], $this, $payload, $bonus);
    }

    protected static function createHandlers() {
        return [
            BinaryStream::PAYLOAD_RESERVED => function ($self, $payload, $bonus) {
                return;
            },
            BinaryStream::PAYLOAD_NEW_STREAM => function ($self, $meta, $streamId) {
                $stream = $self->receiveStream($streamId);
                $self->onStream($stream->getClient(), $stream, $meta);
            },
            BinaryStream::PAYLOAD_DATA => function ($self, $payload, $streamId) {
                $stream = $self->_streams[$streamId];//@TODO: handle exception if not found
                $stream->onData($payload);
            },
            BinaryStream::PAYLOAD_PAUSE => function ($self, $payload, $streamId) {
                $stream = $self->_streams[$streamId];//@TODO: handle exception if not found
                $stream->onPause();
            },
            BinaryStream::PAYLOAD_RESUME => function ($self, $payload, $streamId) {
                $stream = $self->_streams[$streamId];//@TODO: handle exception if not found
                $stream->onResume();
            },
            BinaryStream::PAYLOAD_END => function ($self, $payload, $streamId) {
                $stream = $self->_streams[$streamId];//@TODO: handle exception if not found
                $stream->onEnd();
            },
            BinaryStream::PAYLOAD_CLOSE => function ($self, $payload, $streamId) {
                $stream = $self->_streams[$streamId];//@TODO: handle exception if not found
                $stream->onClose();
            },
        ];
    }
}
