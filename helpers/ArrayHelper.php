<?php

namespace yii\helpers;


use RecursiveArrayIterator;
use RecursiveIteratorIterator;

class ArrayHelper extends BaseArrayHelper {
    public static function flatten($array, $delimiter = '.') {
        $array = static::toArray($array);
        $iterator = new RecursiveIteratorIterator(new RecursiveArrayIterator($array));
        $result = [];
        foreach ($iterator as $leafValue) {
            $keys = [];
            foreach (range(0, $iterator->getDepth()) as $depth) {
                $keys[] = $iterator->getSubIterator($depth)->key();
            }
            $result[join($delimiter, $keys)] = $leafValue;
        }
        return $result;
    }

    /**
     * @inheritdoc
     *
     * @param array|object $array
     * @param array|\Closure|string $key
     * @param null $default
     * @return mixed|null
     */
    public static function getValue($array, $key, $default = null) {
        if ($key instanceof \Closure) {
            return $key($array, $default);
        }

        if (is_array($key)) {
            $lastKey = array_pop($key);
            foreach ($key as $keyPart) {
                $array = static::getValue($array, $keyPart);
            }
            $key = $lastKey;
        }

        if (is_array($array) && (isset($array[$key]) || array_key_exists($key, $array))) {
            return $array[$key];
        }

        if (($pos = strrpos($key, '.')) !== false) {
            $array = static::getValue($array, substr($key, 0, $pos), $default);
            $key = substr($key, $pos + 1);
        }

        if (is_object($array)) {
            // this is expected to fail if the property does not exist, or __get() is not implemented
            // it is not reliably possible to check whether a property is accessible beforehand
            return static::yolo($array, $key);
        } elseif (is_array($array)) {
            return (isset($array[$key]) || array_key_exists($key, $array)) ? $array[$key] : $default;
        } else {
            return $default;
        }
    }

    private static function yolo($obj, $name) {
        if (!isset(get_object_vars($obj)[$name])) {
            try {
                $prop = (new \ReflectionClass($obj))->getProperty($name);
                $prop->setAccessible(true);
                $value = $prop->getValue($obj);
                $prop->setAccessible(false);
                return $value;
            } catch (\ReflectionException $e) {
            }
        }
        return $obj->$name;
    }
}