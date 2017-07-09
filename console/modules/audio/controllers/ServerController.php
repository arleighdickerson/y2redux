<?php


namespace console\modules\audio\controllers;

use ProxyManager\Factory\AccessInterceptorValueHolderFactory;
use Ratchet;
use React;
use yii\base\ErrorException;
use yii\console\Controller;


/**
 * Class ServerController
 * @package console\modules\audio\controllers
 * @property \console\modules\audio\Module $module
 * @property Ratchet\ConnectionInterface[] $conns
 */
class ServerController extends Controller {
    public function actionIndex() {
        $app = new Ratchet\App('localhost', 8889, '0.0.0.0', loop());
        $app->route('/audio/data/', require(__DIR__ . '/../channels/data.php'), ['*']);
        $app->route('/audio/ctl/', require(__DIR__ . '/../channels/ctl.php'), ['*']);
        $this->patchErrorHandler();
        loop()->run();
    }

    protected function patchErrorHandler() {
        /** @var AccessInterceptorValueHolderFactory $proxyFactory */
        $proxyFactory = \Yii::$container->get(AccessInterceptorValueHolderFactory::class);
        $handler = \Yii::$app->errorHandler;
        $handleException = function ($proxy, $instance, $method, $params, & $returnEarly) {
            $exception = null;
            extract($params, EXTR_OVERWRITE);
            static $messageIncludes = 'unable to shutdown socket';
            if ($exception instanceof ErrorException && strpos($exception->getMessage(), $messageIncludes) !== false) {
                $returnEarly = true;
                return;
            }
        };
        $handler->unregister();
        $proxy = $proxyFactory->createProxy($handler, compact('handleException'), []);
        \Yii::$app->set('errorHandler', $proxy);
    }
}

//class Http implements Ratchet\Http\HttpServerInterface {
//}
