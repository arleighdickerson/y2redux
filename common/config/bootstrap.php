<?php

use yii\helpers\Json;

Yii::setAlias('@project', dirname(dirname(__DIR__)));
Yii::setAlias('@common', dirname(__DIR__));
Yii::setAlias('@frontend', dirname(dirname(__DIR__)) . '/frontend');
Yii::setAlias('@backend', dirname(dirname(__DIR__)) . '/backend');
Yii::setAlias('@console', dirname(dirname(__DIR__)) . '/console');
Yii::setAlias('@src', dirname(dirname(__DIR__)) . '/src');
Yii::setAlias('@secrets', dirname(dirname(__DIR__)) . '/secrets');


/**
 * get a reference to the application context
 *
 * @return yii\di\Container
 */
function ctx() {
    return Yii::$container;
}

/**
 * get a reference to the running application
 *
 * @return yii\web\Application
 */
function app() {
    return Yii::$app;
}

/**
 * get a reference to the executing controller
 *
 * @return yii\web\Controller
 */
function controller() {
    return app()->controller;
}

/**
 * get a reference to the applications's view component
 *
 *
 * @return yii\web\View
 */
function view() {
    return app()->view;
}

/**
 * get a reference to the current application user
 *
 * @return yii\web\User;
 */
function user() {
    return app()->user;
}

/**
 * get a reference to the auth manager
 *
 * @return yii\rbac\ManagerInterface
 */
function auth() {
    return app()->get('authManager', true);
}

/**
 * get a reference to the current request
 *
 * @return yii\web\Request|yii\console\Request
 */
function request() {
    return app()->request;
}

/**
 * get a reference to the pending response
 *
 * @return yii\web\Response
 */
function response() {
    return app()->response;
}

/**
 * get a reference to the current session
 *
 * @return yii\web\session;
 */
function session() {
    return app()->session;
}

/**
 * @param $alias
 * @param $throwException
 * @return string
 */
function alias($alias, $throwException = true) {
    return Yii::getAlias($alias, $throwException);
}

/**
 * @param $name
 * @param $throwException
 * @return string
 * @throws yii\base\Exception
 */
function secret($name, $throwException = true) {
    $filename = alias('@project/secrets/' . str_replace('.', '/', $name) . '.json');
    if (file_exists($filename)) {
        return (string)Json::decode(file_get_contents($filename));
    } elseif (!$throwException) {
        return null;
    } else {
        throw new yii\base\Exception("Secret with name `$name` was not found");
    }
}
