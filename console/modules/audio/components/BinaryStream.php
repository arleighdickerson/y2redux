<?php


namespace console\modules\audio\components;


use Evenement\EventEmitterTrait;
use Ratchet\ConnectionInterface;
use React\Stream\DuplexStreamInterface;
use React\Stream\Util;
use React\Stream\WritableStreamInterface;

class BinaryStream implements DuplexStreamInterface {
    use EventEmitterTrait;

    const PAYLOAD_RESERVED = 0;
    const PAYLOAD_NEW_STREAM = 1;
    const PAYLOAD_DATA = 2;
    const PAYLOAD_PAUSE = 3;
    const PAYLOAD_RESUME = 4;
    const PAYLOAD_END = 5;
    const PAYLOAD_CLOSE = 6;

    private $_readable = true;
    private $_writable = true;
    private $_paused = false;

    private $_closed = false;
    private $_ended = false;

    private $_streamId;

    private $_client;
    private $_meta;

    public function __construct(ConnectionInterface $client, $streamId, $options = []) {
        $meta = null;
        $create = false;
        extract($options, EXTR_OVERWRITE);

        $this->_streamId = $streamId;
        $this->_client = $client;
        $this->_meta = $meta ?: [];

        if ($create) {
            $this->_write(BinaryStream::PAYLOAD_NEW_STREAM, $meta);
        }
    }

    public function onDrain() {
        if (!$this->_paused) {
            $this->emit('drain');
        }
    }

    public function onClose() {
        if ($this->_closed) {
            return;
        }
        $this->_readable = false;
        $this->_writable = false;
        $this->_closed = true;
        $this->emit('close');
    }

    public function onError($error) {
        $this->_readable = false;
        $this->_writable = false;
        $this->emit('error', [$error]);
    }

    public function getId() {
        return $this->_streamId;
    }

    public function isReadable() {
        return $this->_readable;
    }

    public function isWritable() {
        return $this->_readable;
    }

    // =======================================================
    // Write Stream
    // =======================================================

    public function onPause() {
        $this->_paused = true;
        $this->emit('pause');
    }

    public function onResume() {
        $this->_paused = false;
        $this->emit('resume');
        $this->emit('drain');
    }

    protected function _write($code, $data = null) {
        if (!$this->_writable) {
            return false;
        }
        $message = Codec::encode([$code, $data, $this->_streamId]);
        $this->_client->sendBinary($message);
        return true;
    }

    public function write($data) {
        if ($this->_writable) {
            $out = $this->_write(self::PAYLOAD_DATA, $data);
            return !$this->_paused && $out;
        } else {
            $this->emit('error', ['stream is not writable']);
        }
    }

    public function end($data = null) {
        if (!$this->isWritable()) {
            return;
        }
        $ended = $this->_ended;
        $this->onEnd();
        if (!$ended) {
            if ($data !== null) {
                $this->_write(BinaryStream::PAYLOAD_DATA, $data);
            }
            $this->_write(BinaryStream::PAYLOAD_END);
        }
    }

    public function close() {
        $closed = $this->_closed;
        $this->onClose();
        if (!$closed) {
            $this->_write(BinaryStream::PAYLOAD_CLOSE);
        }
    }

    // =======================================================
    // Read Stream
    // =======================================================

    public function onEnd() {
        if ($this->_ended) {
            return;
        }
        $this->_ended = true;
        $this->_readable = false;
        $this->emit('end');
    }

    public function onData($data) {
        $this->emit('data', [$data]);
    }

    public function pause() {
        $this->onPause();
        $this->_write(BinaryStream::PAYLOAD_PAUSE);
    }

    public function resume() {
        $this->onResume();
        $this->_write(BinaryStream::PAYLOAD_RESUME);
    }

    /**
     * @return ConnectionInterface
     */
    public function getClient() {
        return $this->_client;
    }

    public function pipe(WritableStreamInterface $dest, array $options = []) {
        Util::pipe($this, $dest, $options);
        return $dest;
    }
}
