<?php
/**
 * @author Arleigh Dickerson
 */

namespace common\helpers;

use ReflectionClass;
use yii\helpers\Inflector;
use yii\helpers\StringHelper;

/**
 * @author Arleigh Dickerson
 *
 * a trait to get information about a class at runtime
 *
 * Class ReflectionTrait
 * @package common\helpers
 */
trait ReflectionTrait {
    /**
     * returns an array of the class constants filtered by constant prefix. Return all if $prefix = null
     * @param null $prefix
     * @return array
     */
    public static function getConstants($prefix = null) {
        $reflector = new ReflectionClass(static::class);
        $constants = $reflector->getConstants();
        if ($prefix !== null) {
            foreach ($constants as $k => $v) {
                if (!StringHelper::startsWith($k, $prefix)) {
                    unset($constants[$k]);
                }
            }
        }
        return array_combine($constants, $constants);
    }

    /**
     * Returns the unqualified class name
     *
     * @return string
     */
    public static function shortName() {
        return (new ReflectionClass(static::class))->getShortName();
    }

    public static function getHumanName() {
        return Inflector::camel2words(static::shortName());
    }

    /**
     * Returns the unqualified class name converted to a hyphenated id
     *
     * @return string
     */
    public static function shortId() {
        return Inflector::camel2id(static::shortName());
    }
}