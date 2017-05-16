<?php

namespace console\controllers;

use common\models\User;
use Yii;
use yii\console\Controller;

class UserController extends Controller {
    use SilentPromptingTrait;

    public function actionCreate() {
        $user = new User;
        $user->username = $this->prompt('username:');
        $user->password = $this->promptSilent('password:');
        $user->validate();
        if (empty($user->getErrors())) {
            $this->stdout("Validation ok.\n");
        } else {
            $this->stdout("Validation Errors: \n");
            foreach ($user->getErrors() as $attribute => $errors) {
                foreach ($errors as $error) {
                    $this->stderr("     " . $error . " \n");
                }
            }
        }
        $this->stdout('Creation of new user ' . ($user->save() ? 'SUCCEEDED' : 'FAILED') . ".");
        $this->stdout("\n");
        return self::EXIT_CODE_NORMAL;
    }

    public function actionDeleteAll() {
        assert(YII_ENV != 'prod');
        User::deleteAll();
    }

}
