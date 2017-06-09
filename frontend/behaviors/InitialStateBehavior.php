<?php


namespace frontend\behaviors;


use yii\base\Behavior;
use yii\base\InvalidParamException;
use yii\helpers\ArrayHelper;
use yii\helpers\Json;
use yii\web\View;

/**
 * This class responsible for registering redux's initial state with the view (via inline javascript)
 * Attach instances to the application's view component;
 *
 * Class InitialStateBehavior
 * @package frontend\components
 * @property View $owner
 * @property array $initialState
 */
class InitialStateBehavior extends Behavior {
    /**
     * @var array|callable|null
     */
    private $_initialState;


    /**
     * @inheritdoc
     */
    public function events() {
        return [
            View::EVENT_BEFORE_RENDER => function () {
                $this->registerInitialState();
            }
        ];
    }

    /**
     * @return array the state tree's current value
     */
    public function getInitialState() {
        if (is_callable($this->_initialState)) {
            $this->_initialState = call_user_func($this->_initialState);
        }
        return $this->_initialState;
    }

    /**
     * @param array|callable $tree the state tree to merge into the current tree
     */
    public function setInitialState($tree) {
        $valid = is_array($tree);
        if ($this->_initialState === null) {
            $valid = $valid || is_callable($tree);
        }
        if (!$valid) {
            throw new InvalidParamException(
                "tree must be an array" . ($this->_initialState === null ? " or a callable" : '')
            );
        }
        $this->_initialState = $this->_initialState === null
            ? $tree
            : ArrayHelper::merge($this->_initialState, $tree);
    }

    /***
     * registers the state tree with the application's view component
     */
    private function registerInitialState() {
        $json = Json::encode($this->getInitialState(), JSON_FORCE_OBJECT | 320);
        $this->owner->registerJs("___INITIAL_STATE__ = $json;", View::POS_HEAD);
    }
}
