<?php


namespace console\modules\audio\util;


use console\modules\audio\components\BinaryStream;
use console\modules\audio\components\Codec;
use console\stream\WritableResourceStream;
use Evenement\EventEmitterInterface;
use MessagePack\Exception\UnpackingFailedException;
use Ratchet\ConnectionInterface;
use React\Stream\WritableStreamInterface;
use yii\helpers\Json;
use yii\helpers\VarDumper;

class Debug {
    public static function sinkServer($prefix, EventEmitterInterface $emitter) {
        self::debug($prefix, "preparing to run main loop");
        loop()->nextTick(function () use ($prefix) {
            self::debug($prefix, "main loop is running");
        });
        $emitter->on('open', function (ConnectionInterface $connection) use ($prefix) {
            self::debug($prefix, "connection opened");
        });
        $emitter->on('close', function (ConnectionInterface $connection) use ($prefix) {
            self::debug($prefix, "connection closed");
        });
        $emitter->on('error', function (ConnectionInterface $connection, $e) use ($prefix) {
            self::debug($prefix, VarDumper::dumpAsString($e), true);
        });
        $emitter->on('message', function (ConnectionInterface $connection, $msg) use ($prefix) {
            self::debug($prefix, "received message $msg");
        });
        $emitter->on('binaryMessage', function (ConnectionInterface $connection, $msg) use ($prefix) {
            list($type, $payload, $bonus) = Codec::decode($msg);
            switch ($type) {
                case BinaryStream::PAYLOAD_RESERVED:
                    break;
                case BinaryStream::PAYLOAD_NEW_STREAM:
                    self::debug($prefix, ">>> $bonus new stream");
                    break;
                case BinaryStream::PAYLOAD_DATA:
                    self::debug($prefix, "+++ $bonus receiving data");
                    break;
                case BinaryStream::PAYLOAD_PAUSE:
                    self::debug($prefix, "||| $bonus paused");
                    break;
                case BinaryStream::PAYLOAD_RESUME:
                    self::debug($prefix, " >> $bonus resumed");
                    break;
                case BinaryStream::PAYLOAD_END:
                    self::debug($prefix, "--- $bonus ended");
                    break;
                case BinaryStream::PAYLOAD_CLOSE:
                    self::debug($prefix, "xxx $bonus closed");
                    break;
                default:
            }
        });
    }

    public static function sinkClient($prefix, EventEmitterInterface $emitter) {
        self::debug($prefix, "preparing to run main loop");
        loop()->nextTick(function () use ($prefix) {
            self::debug($prefix, "main loop is running");
        });
        $emitter->on('open', function () use ($prefix) {
            self::debug($prefix, "connection opened");
        });
        $emitter->on('close', function () use ($prefix) {
            self::debug($prefix, "connection closed");
        });
        $emitter->on('error', function ($e) use ($prefix) {
            self::debug($prefix, VarDumper::dumpAsString($e), true);
        });
        $emitter->on('message', function ($msg) use ($prefix) {
            try {
                list($type, $payload, $bonus) = Codec::decode($msg);
                switch ($type) {
                    case BinaryStream::PAYLOAD_RESERVED:
                        break;
                    case BinaryStream::PAYLOAD_NEW_STREAM:
                        self::debug($prefix, ">>> $bonus new stream");
                        break;
                    case BinaryStream::PAYLOAD_DATA:
                        self::debug($prefix, "+++ $bonus receiving data");
                        break;
                    case BinaryStream::PAYLOAD_PAUSE:
                        self::debug($prefix, "||| $bonus paused");
                        break;
                    case BinaryStream::PAYLOAD_RESUME:
                        self::debug($prefix, " >> $bonus resumed");
                        break;
                    case BinaryStream::PAYLOAD_END:
                        self::debug($prefix, "--- $bonus ended");
                        break;
                    case BinaryStream::PAYLOAD_CLOSE:
                        self::debug($prefix, "xxx $bonus closed");
                        break;
                    default:
                }
            } catch (UnpackingFailedException $e) {
                Json::decode($msg);
                self::debug($prefix, "received message $msg");
            }
        });
    }

    private static $_stdout;
    private static $_stderr;

    public static function debug($prefix, $str, $error = false) {
        if (YII_DEBUG) {
            self::getStream($error)->write("\n[$prefix] " . str_repeat(" ", 3 - strlen($prefix)) . "$str");
        }
    }

    /**
     * @param $error
     * @return WritableStreamInterface
     */
    private static function getStream($error) {
        if ($error) {
            if (self::$_stderr === null) {
                self::$_stderr = new WritableResourceStream(fopen('php://stderr', 'w'), loop());
            }
            return self::$_stderr;
        } else {
            if (self::$_stdout === null) {
                self::$_stdout = new WritableResourceStream(fopen('php://stdout', 'w'), loop());
            }
            return self::$_stdout;

        }
    }
}