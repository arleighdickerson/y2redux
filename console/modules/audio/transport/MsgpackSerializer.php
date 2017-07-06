<?php


namespace console\modules\audio\transport;


use console\modules\audio\components\Codec;
use Thruway\Message\Message;
use Thruway\Serializer\SerializerInterface;
use yii\helpers\ArrayHelper;

class MsgpackSerializer implements SerializerInterface {
    public function serialize(Message $msg) {
        return Codec::encode(
            array_merge(
                [$msg->getMsgCode()],
                ArrayHelper::toArray($msg->getAdditionalMsgFields())
            )
        );
    }

    public function deserialize($serializedData) {
        $decoded = Codec::decode($serializedData);
        $decoded[2] = arrayToObject($decoded[2]);
        return Message::createMessageFromArray($decoded);
    }
}

function arrayToObject($d) {
    if (is_array($d)) {
        return (object)array_map(__FUNCTION__, $d);
    } else {
        return $d;
    }
}
