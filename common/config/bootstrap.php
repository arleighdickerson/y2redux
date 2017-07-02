<?php

use ProxyManager\Factory\AccessInterceptorValueHolderFactory;
use React\ChildProcess\Process;
use React\EventLoop\LoopInterface;
use React\Promise\PromiseInterface;

Yii::setAlias('@project', dirname(dirname(__DIR__)));
Yii::setAlias('@common', dirname(__DIR__));
Yii::setAlias('@frontend', dirname(dirname(__DIR__)) . '/frontend');
Yii::setAlias('@backend', dirname(dirname(__DIR__)) . '/backend');
Yii::setAlias('@console', dirname(dirname(__DIR__)) . '/console');
Yii::setAlias('@src', dirname(dirname(__DIR__)) . '/src');
Yii::setAlias('@secrets', dirname(dirname(__DIR__)) . '/secrets');
Yii::$container
    ->setSingleton(LoopInterface::class, function () {
        return React\EventLoop\Factory::create();
    })
    ->setSingleton('loop', React\EventLoop\LoopInterface::class)
    ->set(Process::class, function ($container, $params, $config) {
        $cwd = alias('@project');
        $env = null;
        $options = [];
        extract($config, EXTR_OVERWRITE);
        /** @var string $cmd */
        $process = new Process($cmd, $cwd, $env, $options);
        /** @var AccessInterceptorValueHolderFactory $factory */
        if (version_compare(phpversion(), '5.5', '<=')) {
            $factory = $container->get(AccessInterceptorValueHolderFactory::class);
            $getPipes = (new \ReflectionClass($process))->getProperty('pipes');
            $process = $factory->createProxy($process, [], [
                    'start' => function () use ($getPipes, $process) {
                        $getPipes->setAccessible(true);
                        $pipes =& $getPipes->getValue($process);
                        // hax to fix SEGFAULT on php 5.5
                        stream_set_read_buffer($pipes[1], 1);
                        stream_set_read_buffer($pipes[2], 1);
                        $getPipes->setAccessible(false);
                    }
                ]
            );
        }
        return $process;
    })
    ->setSingleton(AccessInterceptorValueHolderFactory::class, function ($container, $params, $config) {
        // for the monkeys patching your source
        return new AccessInterceptorValueHolderFactory(ArrayHelper::getValue($params, '0', null));
    });


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
 * @return \yii\rbac\ManagerInterface
 */
function auth() {
    return app()->get('authManager');
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
 * @return LoopInterface
 */
function loop() {
    return ctx()->get(React\EventLoop\LoopInterface::class);
}

/**
 * @param string $name the parameter name
 * @param mixed $defaultValue the default parameter value if the parameter does not exist.
 * @return array|mixed
 */
function get($name = null, $defaultValue = null) {
    return request()->get($name, $defaultValue);
}

/**
 * @param string $name the parameter name
 * @param mixed $defaultValue the default parameter value if the parameter does not exist.
 * @return array|mixed
 */
function post($name = null, $defaultValue = null) {
    return request()->post($name, $defaultValue);
}

/**
 * @param $arg
 */
function print_jer($arg) {
    echo "<pre>";
    print_r($arg);
    echo "</pre>";
}

/**
 * @param $alias
 * @param bool $throwException
 * @return bool|string
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
    $filename = alias('@secrets/' . str_replace('.', '/', $name) . '.json');
    if (file_exists($filename)) {
        return (string)yii\helpers\Json::decode(file_get_contents($filename));
    } elseif (!$throwException) {
        return null;
    } else {
        throw new yii\base\Exception("Secret with name `$name` was not found");
    }
}
