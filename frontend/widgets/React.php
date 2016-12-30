<?php


namespace frontend\widgets;

use frontend\assets\WebpackAsset;
use Yii;
use yii\base\Exception;
use yii\base\Widget;
use yii\bootstrap\Html;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;
use yii\httpclient\Client;
use yii\httpclient\CurlTransport;

class React extends Widget {
    public $initialState = [];
    public $clientConfig = [];

    public function init() {
        parent::init();
        $this->clientConfig = ArrayHelper::merge(
            $this->clientConfig,
            static::defaultClientConfig()
        );
    }

    public function run() {
        WebpackAsset::register($this->view);
        return Html::tag('div', $this->getContent(), ['id' => $this->getId()]);
    }

    protected function getContent() {
        if (ArrayHelper::getValue(Yii::$app->params, 'isomorphic', false)) {
            $client = new Client($this->clientConfig);
            $response = $client->post('', [
                'userAgent' => $_SERVER['HTTP_USER_AGENT'],
                'initialState' => $this->initialState,
            ])->send();
            if (!$response->isOk) {
                throw new Exception($response->getContent());
            }
            return $response->getContent();
        }
        return '';
    }

    protected static function defaultClientConfig() {
        return [
            'transport'=>CurlTransport::class,
            'baseUrl' => Url::base(true) . '/assets/render',
            'requestConfig' => [
                'format' => Client::FORMAT_JSON
            ]
        ];
    }
}
