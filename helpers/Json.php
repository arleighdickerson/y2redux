<?php


namespace yii\helpers;


use yii\base\InvalidParamException;

class Json extends BaseJson {
    public static function escape($json) {
        $cmd = <<<CMD
json_escape () {
    printf '%s' $1 | php -r 'echo json_encode(file_get_contents("php://stdin"));'
}
json_escape '$json'
CMD;
        exec($cmd, $out, $exitCode);
        if ($exitCode != 0) {
            throw new InvalidParamException(VarDumper::dumpAsString($json) . ' could not be escaped');
        }
        return array_pop($out);
    }
}
