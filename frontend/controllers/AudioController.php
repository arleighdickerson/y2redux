<?php

namespace frontend\controllers;

use Nubs\RandomNameGenerator;
use yii\web\Response;

class AudioController extends IsomorphicController {
    public function actionLogin() {
        $this->view->title = 'Front';
    }

    public function actionMain() {
        $this->view->title = 'Main';
    }

    public function actionSurprise() {
        response()->format = Response::FORMAT_JSON;
        $generator = new RandomNameGenerator\Alliteration();
        return $generator->getName();
    }
}
