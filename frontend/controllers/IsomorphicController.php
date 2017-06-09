<?php

namespace frontend\controllers;


use frontend\widgets\React;
use yii\web\Controller;

/**
 * Define actions in subclasses that return the redux state tree to be rendered into the layout.
 * Note that this class does not use traditional views,
 * instead rendering the content of a React widget into a the main layout.
 *
 * In subclasses, define actions that return the redux state tree to be rendered.
 *
 * Class IsomorphicController
 * @package frontend\controllers
 */
abstract class IsomorphicController extends Controller {
    /**
     * @param string $id
     * @param array $params
     * @return mixed|string
     */
    public function runAction($id, $params = []) {
        $result = parent::runAction($id, $params);
        if ($result === null) {
            $result = [];
        }
        if (is_array($result)) {
            $this->view->initialState = $result;
            return $this->renderRoot();
        }
        return $result;
    }

    public function renderRoot() {
        return $this->renderContent(
            React::widget([
                'id' => 'root',
                'initialState' => $this->view->initialState
            ])
        );
    }
}