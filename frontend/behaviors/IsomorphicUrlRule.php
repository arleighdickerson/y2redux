<?php


namespace frontend\behaviors;

use frontend\components\ClosureAction;
use yii\web\UrlRule;

class IsomorphicUrlRule extends UrlRule {
    public static $action;

    public $thunk;

    function createUrl($manager, $route, $params) {
        return false;
    }

    function parseRequest($manager, $request) {
        $manager->cache = false;
        $result = parent::parseRequest($manager, $request);
        if (is_array($result)) {
            $manager->cache = true;
            self::$action = [
                'class' => ClosureAction::class,
                'run' => $this->thunk
            ];
        }
        return $result;
    }
}
