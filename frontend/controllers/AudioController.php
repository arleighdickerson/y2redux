<?php

namespace frontend\controllers;

use Firebase\JWT\JWT;
use GuzzleHttp\Client;
use Nubs\RandomNameGenerator;
use yii\helpers\Json;
use yii\web\Cookie;
use yii\web\JsExpression;
use yii\web\Response;

class AudioController extends IsomorphicController {
    public $key = 'gossamer';

    protected function getState() {
        return [
            'username' => $this->getUsername(),
            'users' => new JsExpression(Json::encode($this->getUsers()))
        ];
    }


    public function init() {
        parent::init();
        if ($this->getUsername()) {
            $this->view->initialState = ['audio' => $this->getState()];
        }
    }

    public function actionState() {
        return $this->getState();
    }

    public function actionLogin() {
        if (request()->isPost) {
            response()->format = Response::FORMAT_JSON;
            $username = post('username', false);
            $username
                ? $this->setUsername($username)
                : response()->setStatusCode(422, "no username in post");
            return response()->send();
        }
        $this->view->title = 'Front';
    }

    public function actionMain() {
        if (!$this->getUsername()) {
            return $this->redirect('login');
        }
        $this->view->title = 'Main';
    }

    public function actionSurprise() {
        response()->format = Response::FORMAT_JSON;
        $generator = new RandomNameGenerator\Alliteration();
        return $generator->getName();
    }

    protected function setUsername($username) {
        $this->_username = $username;
        return response()->getCookies()->add(new Cookie([
                'name' => 'audio',
                'value' => JWT::encode(compact('username'), $this->key)
            ])
        );
    }

    private $_username;

    protected function getUsername() {
        if ($this->_username === null) {
            try {
                $jwt = request()->getCookies()->getValue('audio');
                $this->_username = $jwt ? JWT::decode($jwt, $this->key, ['HS256'])->username : null;
            } catch (\Exception $e) {
                response()->getCookies()->offsetUnset('audio');
                throw $e;
            }
        }
        return $this->_username;
    }

    protected function getUsers() {
        static $json = [
            'procedure' => 'audio.usernames.get',
            'args' => [],
            'argsKw' => []
        ];
        static $url = "http://127.0.0.1:8181/call";
        $client = new Client();
        $response = $client->post($url, compact('json'));
        $body = $response->getBody()->getContents();
        return Json::decode($body)['args'];
    }
}
