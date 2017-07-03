<?php


namespace console\modules\audio\components;


use MessagePack\Packer;
use MessagePack\Unpacker;

final class Codec {
    private function __construct() {
    }

    /**
     * @var Packer
     */
    private static $_packer;

    public static function encode(array $value) {
        if (self::$_packer === null) {
            self::$_packer = new Packer();
        }
        return self::$_packer->packArray($value);
    }

    /**
     * @var Unpacker
     */
    private static $_unpacker;

    public static function decode($value) {
        if (self::$_unpacker === null) {
            self::$_unpacker = new Unpacker();
        }
        return self::$_unpacker->unpack($value);
    }
}
