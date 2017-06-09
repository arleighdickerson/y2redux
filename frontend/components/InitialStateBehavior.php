<?php


namespace frontend\components;


use yii\base\Behavior;
use yii\helpers\Json;
use yii\web\View;

/**
 * Class InitialStateBehavior
 * @package frontend\components
 * @property View $owner
 */
class InitialStateBehavior extends Behavior {
    private $_initialState;

    public function events() {
        return [
            View::EVENT_BEFORE_RENDER => function () {
                $this->registerInitialState();
            }
        ];
    }

    public function getInitialState() {
        if (is_callable($this->_initialState)) {
            $this->_initialState = call_user_func($this->_initialState);
        }
        return $this->_initialState;
    }

    public function setInitialState($initialState) {
        if ($this->getInitialState() === null) {
            $this->_initialState = [];
        }
        $this->_initialState = $initialState;
    }

    private function registerInitialState() {
        $json = $this->initialState === null ? 'undefined' : Json::encode($this->initialState, JSON_FORCE_OBJECT | 320);
        $js = <<<JS
___INITIAL_STATE__ = $json;
JS;
        $this->owner->registerJs($js, View::POS_HEAD);
    }
}
