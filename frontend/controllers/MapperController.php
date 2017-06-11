<?php


namespace frontend\controllers;


use frontend\behaviors\IsomorphicUrlRule;
use yii\web\Controller;

class MapperController extends Controller {
    public $defaultAction = 'default';
    public $action;

    public function init() {
        parent::init();
        $this->action = IsomorphicUrlRule::$action;
    }

    public function actions() {
        $actions = parent::actions();
        if ($this->action) {
            $actions[$this->defaultAction] = $this->action;
        }
        return $actions;
    }
}
