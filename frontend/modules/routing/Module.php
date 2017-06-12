<?php


namespace frontend\modules\routing;


use frontend\modules\routing\behaviors\InitialStateBehavior;
use frontend\modules\routing\components\ClosureAction;
use ProxyManager\Factory\AccessInterceptorScopeLocalizerFactory;
use ProxyManager\Factory\AccessInterceptorValueHolderFactory;
use yii\base\BootstrapInterface;
use yii\di\Instance;
use yii\helpers\ArrayHelper;
use yii\web\Controller;
use yii\web\UrlManager;
use yii\web\UrlRule;
use yii\web\UrlRuleInterface;


class Module extends \yii\base\Module implements UrlRuleInterface, BootstrapInterface {
    /**
     * @var callable
     */
    public $thunk;
    /**
     * @var UrlManager
     */
    private $urlManager = [
        'cache' => false,
        'enableStrictParsing' => true,
        'enablePrettyUrl' => true
    ];

    /**
     * @var AccessInterceptorValueHolderFactory
     */
    private $_proxyFactory;

    public function bootstrap($app) {
        $app->getUrlManager()->addRules([$this], true);
        \Yii::$app->view->attachBehavior('state', [
            'class' => InitialStateBehavior::class,
            'initialState' => function () {
                // the state tree into which we merge additional values specific to the requested action
                return [
                    'routing' => [
                        'location' => [
                            'pathname' => ltrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'),
                        ]
                    ],
                    'user' => \Yii::$app->user->isGuest
                        ? null
                        : \Yii::$app->user->identity->getAttributes(['id', 'username'])
                ];
            }
        ]);
    }

    public function createUrl($manager, $route, $params) {
        return false;
    }

    public function parseRequest($manager, $request) {
        return $this->getUrlManager()->parseRequest($request);
    }

    public function createController($route) {
        $result = parent::createController($route);
        if ($result) {
            $result[0] = $this->createProxy($result[0]);
        }
        return $result;
    }

    public function createProxy(Controller $controller) {
        $actions = function ($proxy, $instance, $jpMethod, $jpParams, &$returnEarly) {
            $result = [
                'index' => [
                    'class' => ClosureAction::class,
                    'thunk' => $this->thunk
                ]
            ];
            $returnEarly = true;
            return $result;
        };
        return $this->getProxyFactory()->createProxy($controller, compact('actions'), []);
    }


    public function setRoutes($routes) {
        if (is_callable($routes)) {
            call_user_func($routes, $this);
            return;
        }
        if (is_array($this->urlManager)) {
            $this->urlManager['rules'] = ArrayHelper::merge(
                ArrayHelper::getValue($this->urlManager, 'rules', []),
                $this->createRules($routes)
            );
        } else {
            $this
                ->getUrlManager()
                ->addRules(array_map($routes, [$this, 'createRules']), false);
        }
    }

    public function createRules(array $routes, $asObjects = false) {
        $rules = array_map(function ($route) {
            list($mount, $path, $thunk) = $route;
            return [
                'class' => IsomorphicUrlRule::class,
                'route' => "{$this->uniqueId}/$mount",
                'pattern' => $path,
                'manager' => $this,
                'thunk' => $thunk,
            ];
        }, $routes);
        return $asObjects ? array_map([\Yii::class, 'createObject'], $rules) : $rules;
    }

    public function addRoute($mount, $path, $thunk = null) {
        if (is_callable($path)) {
            list($path, $thunk) = [$mount, $path];
            $mount = $this->defaultRoute;
        }
        $this->getUrlManager()->addRules($this->createRules([[$mount, $path, $thunk]], true));
        return $this;
    }

    /**
     * @return AccessInterceptorValueHolderFactory
     */
    public function getProxyFactory() {
        if ($this->_proxyFactory === null) {
            $this->_proxyFactory = new AccessInterceptorScopeLocalizerFactory();
        }
        return $this->_proxyFactory;
    }

    /**
     * @return UrlManager
     */
    public function getUrlManager() {
        $this->urlManager = Instance::ensure($this->urlManager, UrlManager::class);
        return $this->urlManager;
    }
}

class IsomorphicUrlRule extends UrlRule {
    public $manager;
    public $thunk;

    function createUrl($manager, $route, $params) {
        return false;
    }

    function parseRequest($manager, $request) {
        $result = parent::parseRequest($manager, $request);
        if (is_array($result)) {
            $this->manager->thunk = $this->thunk;
        }
        return $result;
    }
}