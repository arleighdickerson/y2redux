<?php


namespace frontend\widgets;

use frontend\assets\WebpackAsset;
use Yii;
use yii\base\Exception;
use yii\base\Widget;
use yii\bootstrap\Html;
use yii\helpers\ArrayHelper;
use yii\httpclient\Client;
use yii\httpclient\CurlTransport;

/**
 * A yii widget that renders the root react component as html.
 *
 *  - If isomorphic rendering is enabled, the widget will call out to the node
 *    rendering service to get the component's rendered html.
 *
 *  - If isomorphic rendering is not enabled, the widget will simply render an
 *    empty div to serve as the component's mount node.
 *
 * Class React
 * @package frontend\widgets
 */
class React extends Widget {
    /**
     * @var array a redux state tree
     */
    public $initialState = [];

    /**
     * @var array overrides for the yii http client used to call out to the rendering service
     */
    public $clientConfig = [];

    /**
     * @inheritdoc
     */
    public function init() {
        parent::init();
        $this->clientConfig = ArrayHelper::merge(
            $this->clientConfig,
            static::defaultClientConfig()
        );
    }

    /**
     * @return string
     */
    public function run() {
        WebpackAsset::register($this->view);
        return Html::tag('div', $this->getContent(), ['id' => $this->getId()]);
    }

    /**
     * Returns rendered content if isomorphic or a mount node if not
     *
     * @return string
     * @throws Exception
     */
    protected function getContent() {
        if (ArrayHelper::getValue(Yii::$app->params, 'isomorphic', false)) {
            $client = new Client($this->clientConfig);
            $response = $client->post('', [
                'userAgent' => $_SERVER['HTTP_USER_AGENT'],
                'initialState' => $this->initialState,
            ])->send();
            if (!$response->isOk) {
                $message = "Call to node rendering service failed with response \"\n{$response->getContent()}\"";
                if (YII_DEBUG) {
                    //throw an exception if we're in debug
                    throw new Exception($message);
                } else {
                    //otherwise hit the logs and fall back to client-side rendering
                    Yii::error($message, 'react');
                }
            }
            return $response->getContent();
        }
        return '';
    }

    /**
     * @return array the default configuration for the http client
     */
    protected static function defaultClientConfig() {
        return [
            'transport' => CurlTransport::class,
            'baseUrl' => YII_ENV_DEV ? '10.0.2.2:3001' : '127.0.0.1:3001',
            'requestConfig' => [
                'format' => Client::FORMAT_JSON
            ]
        ];
    }
}
