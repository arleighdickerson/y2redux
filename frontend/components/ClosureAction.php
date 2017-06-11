<?php


namespace frontend\components;


use ReflectionFunction;
use Yii;
use yii\base\Action;
use yii\base\InvalidConfigException;
use yii\web\BadRequestHttpException;

class ClosureAction extends Action {
    public $run;

    public function runWithParams($params) {
        if (!is_callable($this->run)) {
            throw new InvalidConfigException(get_class($this) . '::run must be callable');
        }
        $args = $this->bindActionParams($params);
        Yii::trace('Running action: ' . get_class($this) . '::run', __METHOD__);
        if (Yii::$app->requestedParams === null) {
            Yii::$app->requestedParams = $args;
        }
        if ($this->beforeRun()) {
            $result = call_user_func_array($this->run, $args);
            $this->afterRun();

            return $result;
        } else {
            return null;
        }
    }

    protected function bindActionParams($params) {
        $method = new ReflectionFunction($this->run);
        $args = [];
        $missing = [];
        $actionParams = [];
        foreach ($method->getParameters() as $param) {
            $name = $param->getName();
            if (array_key_exists($name, $params)) {
                if ($param->isArray()) {
                    $args[] = $actionParams[$name] = (array)$params[$name];
                } elseif (!is_array($params[$name])) {
                    $args[] = $actionParams[$name] = $params[$name];
                } else {
                    throw new BadRequestHttpException(Yii::t('yii', 'Invalid data received for parameter "{param}".', [
                        'param' => $name,
                    ]));
                }
                unset($params[$name]);
            } elseif ($param->isDefaultValueAvailable()) {
                $args[] = $actionParams[$name] = $param->getDefaultValue();
            } else {
                $missing[] = $name;
            }
        }

        if (!empty($missing)) {
            throw new BadRequestHttpException(Yii::t('yii', 'Missing required parameters: {params}', [
                'params' => implode(', ', $missing),
            ]));
        }

        $this->controller->actionParams = $actionParams;

        return $args;
    }

    private final function run() {
        // We wouldn't want somebody to mistakenly define run as a method
    }
}
