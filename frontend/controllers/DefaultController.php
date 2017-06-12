<?php

namespace frontend\controllers;

use common\models\LoginForm;
use frontend\models\ContactForm;
use frontend\models\PasswordResetRequestForm;
use frontend\models\ResetPasswordForm;
use frontend\models\SignupForm;
use Yii;
use yii\base\InvalidParamException;
use yii\filters\AccessControl;
use yii\filters\VerbFilter;
use yii\helpers\ArrayHelper;
use yii\helpers\Json;
use yii\web\BadRequestHttpException;
use yii\web\Controller;
use yii\web\Response;

/**
 * Site controller
 */
class DefaultController extends Controller {
    /**
     * @inheritdoc
     */
    public function actions() {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ]
        ];
    }

    public function actionIndex() {
        $this->view->title = 'Arleigh Dickerson';
    }

    public function actionContact() {
        $this->view->title = 'Contact Me';
    }

    public function actionSkill($name = null) {
        $this->view->title = $name === null ? 'Skills Index' : $name;
    }

    public function actionProg($name = null) {
        $this->view->title = $name === null ? 'Progs Index' : $name;
    }
}
