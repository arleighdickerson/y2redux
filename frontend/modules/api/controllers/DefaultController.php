<?php


namespace frontend\modules\api\controllers;


use common\models\LoginForm;
use frontend\models\ContactForm;
use Yii;
use yii\filters\AccessControl;
use yii\filters\VerbFilter;
use yii\helpers\ArrayHelper;
use yii\web\Controller;
use yii\web\Response;

class DefaultController extends Controller {
    public function behaviors() {
        return ArrayHelper::merge(parent::behaviors(), [
            'access' => [
                'class' => AccessControl::class,
                'only' => ['login', 'logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                    [
                        'actions' => ['login'],
                        'allow' => true,
                        'roles' => ['?'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'login' => ['post'],
                    'logout' => ['post'],
                ],
            ],
        ]);
    }

    public function init() {
        parent::init();
        Yii::$app->response->format = Response::FORMAT_JSON;
    }

    public function actionLogout() {
        Yii::$app->user->logout();
        return null;
    }

    public function actionLogin() {
        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post(), '') && $model->login()) {
            return Yii::$app->user->identity;
        }
        $res = Yii::$app->response;
        $res->statusCode = 422;
        $res->statusText = 'Authentication Failure';
    }

    public function actionContact() {
        $model = new ContactForm();
        $post = request()->post();
        if ($model->load($post, '') && $model->validate()) {
            if ($model->sendEmail(Yii::$app->params['adminEmail'])) {
                return [];
            } else {
                response()->statusCode = 422;
                response()->statusText = 'Validation Failure';
                return ArrayHelper::getColumn($model->getErrors(), '0');
            }
        }
        return null;
    }
}
