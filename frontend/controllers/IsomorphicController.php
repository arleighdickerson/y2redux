<?php

namespace frontend\controllers;


use frontend\widgets\React;
use yii\web\Controller;

class IsomorphicController extends Controller {
    public function runAction($id, $params = []) {
        $result = parent::runAction($id, $params);
        return $result === null ? $this->renderRoot() : $result;
    }

    public function renderRoot() {
        return $this->renderContent(React::widget([
            'id' => 'root',
            'initialState' => $this->view->initialState
        ]));
    }
}