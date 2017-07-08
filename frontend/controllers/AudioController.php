<?php

namespace frontend\controllers;

use Nubs\RandomNameGenerator;
use yii\db\Exception;
use yii\helpers\ArrayHelper;
use yii\web\Response;

class AudioController extends IsomorphicController {
    public function init() {
        parent::init();
        if ($this->getUsername()) {
            $this->view->initialState = [
                'audio' => [
                    'username' => $this->getUsername()
                ]
            ];
        }
    }

    public function actionLogin() {
        if (request()->isPost) {
            response()->format = Response::FORMAT_JSON;
            $username = post('username', false);
            return $username
                ? $this->setUsername($username)
                : response()->setStatusCode(422, "no username in post");
        }
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

    protected function setUsername($username) {
        if (!session()->isActive) {
            session()->open();
            session()->set('audio', compact('username'));
        }
        response()->setStatusCode(200);
    }

    protected function getUsername() {
        return session()->isActive
            ? ArrayHelper::getValue(session(), 'audio.username')
            : null;
    }
}
