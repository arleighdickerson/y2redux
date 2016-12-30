<?php


namespace frontend\assets;


use PHPHtmlParser\Dom;
use PHPHtmlParser\Exceptions\EmptyCollectionException;
use Yii;
use yii\base\ErrorException;
use yii\base\Exception;
use yii\caching\ExpressionDependency;
use yii\helpers\ArrayHelper;
use yii\helpers\StringHelper;
use yii\web\AssetBundle;
use yii\web\View;

class WebpackAsset extends AssetBundle {
    public static $templatePath = "@frontend/runtime/webpack/index.html";

    public $depends = [
        HeadAsset::class,
        BodyAsset::class
    ];

    public static function register($view) {
        self::configureChildAssets();
        return parent::register($view);
    }

    public static function getBundleSrc($name, $type = 'js') {
        $path = Yii::getAlias('@frontend/web' . self::getBundleUrl($name, $type));
        if (($contents = file_get_contents($path)) !== false) {
            return $contents;
        } else {
            throw new Exception("Could not find file with path '$path'");
        }
    }

    public static function getBundleUrl($name, $type = 'js') {
        foreach (static::resolveUrls() as $class => $config) {
            foreach (ArrayHelper::getValue($config, $type, []) as list($path)) {
                $basename = basename($path);
                if (StringHelper::startsWith($basename, $name . ".")) {
                    return $path;
                }
            }
        }
        throw new Exception("Bundle with name $name could not be resolved");
    }

    /**
     * @var Dom
     */
    private static $_dom;

    /**
     * @return Dom
     */
    private static function getDom() {
        if (self::$_dom === null) {
            self::$_dom = new Dom;
            self::complainIfTemplateMissing(function () {
                self::$_dom->loadFromFile(Yii::getAlias(self::$templatePath), [
                    'removeScripts' => false
                ]);
            });
        }
        return self::$_dom;
    }

    private static function configureChildAssets() {
        foreach (self::resolveUrls() as $class => $config) {
            Yii::$app->assetManager->bundles[$class] = $config;
        }
    }

    private static function resolveUrls() {
        $result = self::complainIfTemplateMissing(function () {
            return Yii::$app->cache->get(self::class);
        });
        if ($result === false) {
            $result = [
                HeadAsset::class => [
                    'css' => self::scrapeCssUrls(View::POS_HEAD),
                    'js' => self::scrapeJsUrls(View::POS_HEAD),
                ],
                BodyAsset::class => [
                    'js' => self::scrapeJsUrls(View::POS_END),
                ]
            ];
            Yii::$app->cache->set(self::class, $result, 0, new ExpressionDependency([
                'expression' => 'filemtime($this->params)',
                'params' => Yii::getAlias(self::$templatePath)
            ]));
        }
        return $result;
    }

    private static function scrapeCssUrls($pos) {
        return self::getChildTags('link', $pos, 'href');
    }

    private static function scrapeJsUrls($pos) {
        return self::getChildTags('script', $pos, 'src');
    }


    private static function getChildTags($tag, $pos, $attr) {
        return iterator_to_array(static::queryChildTags($tag, $pos, $attr));
    }

    private static function queryChildTags($tag, $pos, $attr) {
        $selector = [
            View::POS_HEAD => 'head',
            View::POS_END => 'body',
        ][$pos];
        try {
            foreach (self::getDom()->find($selector)->find($tag) as $node) {
                $attrs = $node->getAttributes();
                unset($attrs[$attr]);
                array_unshift($attrs, parse_url($node->getAttribute($attr), PHP_URL_PATH));
                yield $attrs;
            }
        } catch (EmptyCollectionException $e) {
        }
    }

    private static function complainIfTemplateMissing($cb) {
        try {
            return $cb();
        } catch (ErrorException $e) {
            throw new Exception("Url template file not found at path '"
                . self::$templatePath
                . "'. Is the node development server turned on?");
        }
    }
}

class HeadAsset extends AssetBundle {
    public $basePath = '@webroot/assets';
    public $baseUrl = '@web/assets';
    public $jsOptions = [
        'position' => View::POS_HEAD
    ];
}

class BodyAsset extends AssetBundle {
    public $basePath = '@webroot/assets';
    public $baseUrl = '@web/assets';
    public $jsOptions = [
        'position' => View::POS_END
    ];
}
